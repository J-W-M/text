package handlers

import (
	"time"

	"lingxi-api/internal/database"
	"lingxi-api/internal/models"
	"lingxi-api/internal/middleware/request"
	"lingxi-api/pkg/auth"
	"lingxi-api/pkg/response"

	"github.com/gin-gonic/gin"
	"golang.org/x/crypto/bcrypt"
)

// AuthHandler 认证处理器
type AuthHandler struct{}

func NewAuthHandler() *AuthHandler {
	return &AuthHandler{}
}

// RegisterRequest 注册请求
type RegisterRequest struct {
	Username string `json:"username" binding:"required,min=3,max=50"`
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required,min=6,max=20"`
}

// LoginRequest 登录请求
type LoginRequest struct {
	Username string `json:"username" binding:"required"`
	Password string `json:"password" binding:"required"`
}

// LoginResponse 登录响应
type LoginResponse struct {
	Token    string      `json:"token"`
	User     *models.User `json:"user"`
}

// Register 用户注册
func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	// 检查用户名是否存在
	var count int64
	database.DB.Model(&models.User{}).Where("username = ?", req.Username).Count(&count)
	if count > 0 {
		response.Error(c, 400, "用户名已存在")
		return
	}

	// 检查邮箱是否存在
	database.DB.Model(&models.User{}).Where("email = ?", req.Email).Count(&count)
	if count > 0 {
		response.Error(c, 400, "邮箱已被注册")
		return
	}

	// 加密密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		response.InternalError(c, "密码加密失败")
		return
	}

	// 创建用户
	user := models.User{
		Username: req.Username,
		Email:    req.Email,
		Password: string(hashedPassword),
		Nickname: req.Username,
		Role:     "user",
		Status:   1,
	}

	if err := database.DB.Create(&user).Error; err != nil {
		response.InternalError(c, "创建用户失败")
		return
	}

	// 生成token
	token, err := auth.GenerateToken(user.ID, user.Username, user.Role)
	if err != nil {
		response.InternalError(c, "生成token失败")
		return
	}

	response.Success(c, LoginResponse{
		Token: token,
		User:  &user,
	})
}

// Login 用户登录
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	// 查找用户
	var user models.User
	if err := database.DB.Where("username = ? OR email = ?", req.Username, req.Username).First(&user).Error; err != nil {
		response.Error(c, 401, "用户名或密码错误")
		return
	}

	// 检查用户状态
	if user.Status == 0 {
		response.Error(c, 403, "账号已被禁用")
		return
	}

	// 验证密码
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		response.Error(c, 401, "用户名或密码错误")
		return
	}

	// 更新最后登录时间
	now := time.Now()
	database.DB.Model(&user).Updates(map[string]interface{}{
		"last_login_at": now,
		"last_login_ip": c.ClientIP(),
	})

	// 生成token
	token, err := auth.GenerateToken(user.ID, user.Username, user.Role)
	if err != nil {
		response.InternalError(c, "生成token失败")
		return
	}

	response.Success(c, LoginResponse{
		Token: token,
		User:  &user,
	})
}

// Logout 用户登出
func (h *AuthHandler) Logout(c *gin.Context) {
	// JWT无状态，登出只需客户端删除token
	// 如果需要服务端黑名单，可以在这里实现
	response.SuccessWithMessage(c, "登出成功", nil)
}

// RefreshToken 刷新Token
func (h *AuthHandler) RefreshToken(c *gin.Context) {
	token := c.GetString("token")
	if token == "" {
		response.Unauthorized(c, "未找到token")
		return
	}

	newToken, err := auth.RefreshToken(token)
	if err != nil {
		response.Unauthorized(c, "token刷新失败")
		return
	}

	response.Success(c, gin.H{
		"token": newToken,
	})
}

// GetCurrentUser 获取当前用户信息
func (h *AuthHandler) GetCurrentUser(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		response.NotFound(c, "用户不存在")
		return
	}

	response.Success(c, &user)
}

// UpdateUserRequest 更新用户请求
type UpdateUserRequest struct {
	Nickname string `json:"nickname"`
	Avatar   string `json:"avatar"`
	Phone    string `json:"phone"`
	Bio      string `json:"bio"`
	Gender   int    `json:"gender"`
}

// UpdateUser 更新用户信息
func (h *AuthHandler) UpdateUser(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	var req UpdateUserRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	updates := map[string]interface{}{}
	if req.Nickname != "" {
		updates["nickname"] = req.Nickname
	}
	if req.Avatar != "" {
		updates["avatar"] = req.Avatar
	}
	if req.Phone != "" {
		updates["phone"] = req.Phone
	}
	if req.Bio != "" {
		updates["bio"] = req.Bio
	}
	if req.Gender > 0 {
		updates["gender"] = req.Gender
	}

	if len(updates) == 0 {
		response.BadRequest(c, "没有需要更新的内容")
		return
	}

	if err := database.DB.Model(&models.User{}).Where("id = ?", userID).Updates(updates).Error; err != nil {
		response.InternalError(c, "更新失败")
		return
	}

	// 返回更新后的用户信息
	var user models.User
	database.DB.First(&user, userID)

	response.Success(c, &user)
}

// ChangePasswordRequest 修改密码请求
type ChangePasswordRequest struct {
	OldPassword string `json:"oldPassword" binding:"required"`
	NewPassword string `json:"newPassword" binding:"required,min=6,max=20"`
}

// ChangePassword 修改密码
func (h *AuthHandler) ChangePassword(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	var req ChangePasswordRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		response.NotFound(c, "用户不存在")
		return
	}

	// 验证旧密码
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.OldPassword)); err != nil {
		response.Error(c, 400, "原密码错误")
		return
	}

	// 加密新密码
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.NewPassword), bcrypt.DefaultCost)
	if err != nil {
		response.InternalError(c, "密码加密失败")
		return
	}

	// 更新密码
	database.DB.Model(&user).Update("password", string(hashedPassword))

	response.SuccessWithMessage(c, "密码修改成功", nil)
}