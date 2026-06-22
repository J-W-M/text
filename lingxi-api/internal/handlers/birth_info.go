package handlers

import (
	"time"

	"lingxi-api/internal/database"
	"lingxi-api/internal/models"
	"lingxi-api/internal/middleware/request"
	"lingxi-api/pkg/response"

	"github.com/gin-gonic/gin"
)

// BirthInfoHandler 生辰信息处理器
type BirthInfoHandler struct{}

func NewBirthInfoHandler() *BirthInfoHandler {
	return &BirthInfoHandler{}
}

// CreateBirthInfoRequest 创建生辰信息请求
type CreateBirthInfoRequest struct {
	Name        string  `json:"name" binding:"required"`
	Gender      int     `json:"gender" binding:"required,min=1,max=2"`
	BirthYear   int     `json:"birthYear" binding:"required"`
	BirthMonth  int     `json:"birthMonth" binding:"required,min=1,max=12"`
	BirthDay    int     `json:"birthDay" binding:"required,min=1,max=31"`
	BirthHour   int     `json:"birthHour" binding:"required,min=0,max=23"`
	BirthMinute int     `json:"birthMinute" binding:"required,min=0,max=59"`
	IsLunar     bool    `json:"isLunar"`
	Province    string  `json:"province"`
	City        string  `json:"city"`
	Longitude   float64 `json:"longitude"`
	Latitude    float64 `json:"latitude"`
	Remark      string  `json:"remark"`
	IsDefault   bool    `json:"isDefault"`
}

// CreateBirthInfo 创建生辰信息
func (h *BirthInfoHandler) CreateBirthInfo(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	var req CreateBirthInfoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	// 如果设置为默认，先取消其他默认
	if req.IsDefault {
		database.DB.Model(&models.BirthInfo{}).Where("user_id = ?", userID).Update("is_default", false)
	}

	birthInfo := models.BirthInfo{
		UserID:      userID,
		Name:        req.Name,
		Gender:      req.Gender,
		BirthYear:   req.BirthYear,
		BirthMonth:  req.BirthMonth,
		BirthDay:    req.BirthDay,
		BirthHour:   req.BirthHour,
		BirthMinute: req.BirthMinute,
		IsLunar:     req.IsLunar,
		Province:    req.Province,
		City:        req.City,
		Longitude:   req.Longitude,
		Latitude:    req.Latitude,
		Remark:      req.Remark,
		IsDefault:   req.IsDefault,
	}

	if err := database.DB.Create(&birthInfo).Error; err != nil {
		response.InternalError(c, "创建失败")
		return
	}

	response.Success(c, &birthInfo)
}

// GetBirthInfoList 获取生辰信息列表
func (h *BirthInfoHandler) GetBirthInfoList(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	var birthInfos []models.BirthInfo
	if err := database.DB.Where("user_id = ?", userID).Order("is_default desc, created_at desc").Find(&birthInfos).Error; err != nil {
		response.InternalError(c, "查询失败")
		return
	}

	response.Success(c, birthInfos)
}

// GetBirthInfo 获取单个生辰信息
func (h *BirthInfoHandler) GetBirthInfo(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	id := c.Param("id")
	if id == "" {
		response.BadRequest(c, "缺少id参数")
		return
	}

	var birthInfo models.BirthInfo
	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&birthInfo).Error; err != nil {
		response.NotFound(c, "生辰信息不存在")
		return
	}

	response.Success(c, &birthInfo)
}

// UpdateBirthInfo 更新生辰信息
func (h *BirthInfoHandler) UpdateBirthInfo(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	id := c.Param("id")
	if id == "" {
		response.BadRequest(c, "缺少id参数")
		return
	}

	var birthInfo models.BirthInfo
	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&birthInfo).Error; err != nil {
		response.NotFound(c, "生辰信息不存在")
		return
	}

	var req CreateBirthInfoRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	// 如果设置为默认，先取消其他默认
	if req.IsDefault {
		database.DB.Model(&models.BirthInfo{}).Where("user_id = ? AND id != ?", userID, birthInfo.ID).Update("is_default", false)
	}

	updates := map[string]interface{}{
		"name":        req.Name,
		"gender":      req.Gender,
		"birth_year":  req.BirthYear,
		"birth_month": req.BirthMonth,
		"birth_day":   req.BirthDay,
		"birth_hour":  req.BirthHour,
		"birth_minute": req.BirthMinute,
		"is_lunar":    req.IsLunar,
		"province":    req.Province,
		"city":        req.City,
		"longitude":   req.Longitude,
		"latitude":    req.Latitude,
		"remark":      req.Remark,
		"is_default":  req.IsDefault,
		"updated_at":  time.Now(),
	}

	if err := database.DB.Model(&birthInfo).Updates(updates).Error; err != nil {
		response.InternalError(c, "更新失败")
		return
	}

	// 返回更新后的数据
	database.DB.First(&birthInfo, birthInfo.ID)
	response.Success(c, &birthInfo)
}

// DeleteBirthInfo 删除生辰信息
func (h *BirthInfoHandler) DeleteBirthInfo(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	id := c.Param("id")
	if id == "" {
		response.BadRequest(c, "缺少id参数")
		return
	}

	result := database.DB.Where("id = ? AND user_id = ?", id, userID).Delete(&models.BirthInfo{})
	if result.Error != nil {
		response.InternalError(c, "删除失败")
		return
	}

	if result.RowsAffected == 0 {
		response.NotFound(c, "生辰信息不存在")
		return
	}

	response.SuccessWithMessage(c, "删除成功", nil)
}

// SetDefaultBirthInfo 设置默认生辰信息
func (h *BirthInfoHandler) SetDefaultBirthInfo(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	id := c.Param("id")
	if id == "" {
		response.BadRequest(c, "缺少id参数")
		return
	}

	var birthInfo models.BirthInfo
	if err := database.DB.Where("id = ? AND user_id = ?", id, userID).First(&birthInfo).Error; err != nil {
		response.NotFound(c, "生辰信息不存在")
		return
	}

	// 取消其他默认
	database.DB.Model(&models.BirthInfo{}).Where("user_id = ?", userID).Update("is_default", false)
	// 设置当前为默认
	database.DB.Model(&birthInfo).Update("is_default", true)

	response.SuccessWithMessage(c, "设置成功", nil)
}