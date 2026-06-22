package handlers

import (
	"strconv"

	"lingxi-api/internal/database"
	"lingxi-api/internal/models"
	"lingxi-api/internal/middleware/request"
	"lingxi-api/pkg/response"

	"github.com/gin-gonic/gin"
)

// CommunityHandler 社区处理器
type CommunityHandler struct{}

func NewCommunityHandler() *CommunityHandler {
	return &CommunityHandler{}
}

// CreatePostRequest 创建帖子请求
type CreatePostRequest struct {
	Title    string `json:"title" binding:"required,min=5,max=100"`
	Content  string `json:"content" binding:"required,min=10"`
	Category string `json:"category"`
}

// CreatePost 创建帖子
func (h *CommunityHandler) CreatePost(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	var req CreatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	if req.Category == "" {
		req.Category = "general"
	}

	post := models.CommunityPost{
		UserID:   userID,
		Title:    req.Title,
		Content:  req.Content,
		Category: req.Category,
		Status:   1,
	}

	if err := database.DB.Create(&post).Error; err != nil {
		response.InternalError(c, "创建失败")
		return
	}

	// 加载用户信息
	var user models.User
	database.DB.First(&user, userID)
	post.User = &user

	response.Success(c, &post)
}

// GetPostList 获取帖子列表
func (h *CommunityHandler) GetPostList(c *gin.Context) {
	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "20"))
	category := c.Query("category")

	var posts []models.CommunityPost
	var total int64

	query := database.DB.Model(&models.CommunityPost{}).Where("status >= ?", 1)
	if category != "" {
		query = query.Where("category = ?", category)
	}

	query.Count(&total)
	query.Order("status desc, created_at desc").Limit(pageSize).Offset((page - 1) * pageSize).Find(&posts)

	// 加载用户信息
	for i := range posts {
		var user models.User
		database.DB.First(&user, posts[i].UserID)
		posts[i].User = &user
	}

	response.PageSuccess(c, posts, total, page, pageSize)
}

// GetPost 获取帖子详情
func (h *CommunityHandler) GetPost(c *gin.Context) {
	postIDStr := c.Param("postId")
	postID, _ := strconv.ParseUint(postIDStr, 10, 32)

	var post models.CommunityPost
	if err := database.DB.Where("id = ? AND status >= ?", postID, 1).First(&post).Error; err != nil {
		response.NotFound(c, "帖子不存在")
		return
	}

	// 增加浏览量
	database.DB.Model(&post).Update("view_count", post.ViewCount+1)

	// 加载用户信息
	var user models.User
	database.DB.First(&user, post.UserID)
	post.User = &user

	// 获取评论
	var comments []models.PostComment
	database.DB.Where("post_id = ? AND status = ?", postID, 1).Order("created_at asc").Find(&comments)
	for i := range comments {
		var commentUser models.User
		database.DB.First(&commentUser, comments[i].UserID)
		comments[i].User = &commentUser
	}

	// 检查用户是否点赞
	userID := request.GetUserID(c)
	isLiked := false
	if userID > 0 {
		var like models.PostLike
		if database.DB.Where("post_id = ? AND user_id = ?", postID, userID).First(&like).Error == nil {
			isLiked = true
		}
	}

	response.Success(c, gin.H{
		"post":     post,
		"comments": comments,
		"isLiked":  isLiked,
	})
}

// DeletePost 删除帖子
func (h *CommunityHandler) DeletePost(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	postIDStr := c.Param("postId")
	postID, _ := strconv.ParseUint(postIDStr, 10, 32)

	var post models.CommunityPost
	if err := database.DB.Where("id = ?", postID).First(&post).Error; err != nil {
		response.NotFound(c, "帖子不存在")
		return
	}

	// 验证权限（作者或管理员）
	role := request.GetRole(c)
	if post.UserID != userID && role != "admin" {
		response.Forbidden(c, "无权限删除")
		return
	}

	// 删除帖子和相关数据
	database.DB.Where("post_id = ?", postID).Delete(&models.PostComment{})
	database.DB.Where("post_id = ?", postID).Delete(&models.PostLike{})
	database.DB.Delete(&post)

	response.SuccessWithMessage(c, "删除成功", nil)
}

// LikePost 点赞帖子
func (h *CommunityHandler) LikePost(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	postIDStr := c.Param("postId")
	postID, _ := strconv.ParseUint(postIDStr, 10, 32)

	var post models.CommunityPost
	if err := database.DB.Where("id = ? AND status >= ?", postID, 1).First(&post).Error; err != nil {
		response.NotFound(c, "帖子不存在")
		return
	}

	// 检查是否已点赞
	var existingLike models.PostLike
	if database.DB.Where("post_id = ? AND user_id = ?", postID, userID).First(&existingLike).Error == nil {
		// 已点赞，取消点赞
		database.DB.Delete(&existingLike)
		database.DB.Model(&post).Update("like_count", post.LikeCount-1)
		response.Success(c, gin.H{"liked": false, "likeCount": post.LikeCount - 1})
		return
	}

	// 创建点赞
	like := models.PostLike{
		PostID: uint(postID),
		UserID: userID,
	}
	database.DB.Create(&like)
	database.DB.Model(&post).Update("like_count", post.LikeCount+1)

	response.Success(c, gin.H{"liked": true, "likeCount": post.LikeCount + 1})
}

// CreateCommentRequest 创建评论请求
type CreateCommentRequest struct {
	Content  string `json:"content" binding:"required,min=5"`
	ParentID uint   `json:"parentId"` // 回复的评论ID
}

// CreateComment 创建评论
func (h *CommunityHandler) CreateComment(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	postIDStr := c.Param("postId")
	postID, _ := strconv.ParseUint(postIDStr, 10, 32)

	var post models.CommunityPost
	if err := database.DB.Where("id = ? AND status >= ?", postID, 1).First(&post).Error; err != nil {
		response.NotFound(c, "帖子不存在")
		return
	}

	var req CreateCommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	comment := models.PostComment{
		PostID:   uint(postID),
		UserID:   userID,
		ParentID: req.ParentID,
		Content:  req.Content,
		Status:   1,
	}

	if err := database.DB.Create(&comment).Error; err != nil {
		response.InternalError(c, "创建失败")
		return
	}

	// 更新帖子评论数
	database.DB.Model(&post).Update("comment_count", post.CommentCount+1)

	// 加载用户信息
	var user models.User
	database.DB.First(&user, userID)
	comment.User = &user

	response.Success(c, &comment)
}

// DeleteComment 删除评论
func (h *CommunityHandler) DeleteComment(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	commentIDStr := c.Param("commentId")
	commentID, _ := strconv.ParseUint(commentIDStr, 10, 32)

	var comment models.PostComment
	if err := database.DB.Where("id = ?", commentID).First(&comment).Error; err != nil {
		response.NotFound(c, "评论不存在")
		return
	}

	// 验证权限
	role := request.GetRole(c)
	if comment.UserID != userID && role != "admin" {
		response.Forbidden(c, "无权限删除")
		return
	}

	// 删除评论
	database.DB.Delete(&comment)

	// 更新帖子评论数
	database.DB.Model(&models.CommunityPost{}).Where("id = ?", comment.PostID).
		UpdateColumn("comment_count", database.DB.Raw("comment_count - 1"))

	response.SuccessWithMessage(c, "删除成功", nil)
}

// LikeComment 点赞评论
func (h *CommunityHandler) LikeComment(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	commentIDStr := c.Param("commentId")
	commentID, _ := strconv.ParseUint(commentIDStr, 10, 32)

	var comment models.PostComment
	if err := database.DB.Where("id = ? AND status = ?", commentID, 1).First(&comment).Error; err != nil {
		response.NotFound(c, "评论不存在")
		return
	}

	// 检查是否已点赞
	var existingLike models.CommentLike
	if database.DB.Where("comment_id = ? AND user_id = ?", commentID, userID).First(&existingLike).Error == nil {
		// 已点赞，取消点赞
		database.DB.Delete(&existingLike)
		database.DB.Model(&comment).Update("like_count", comment.LikeCount-1)
		response.Success(c, gin.H{"liked": false, "likeCount": comment.LikeCount - 1})
		return
	}

	// 创建点赞
	like := models.CommentLike{
		CommentID: uint(commentID),
		UserID:    userID,
	}
	database.DB.Create(&like)
	database.DB.Model(&comment).Update("like_count", comment.LikeCount+1)

	response.Success(c, gin.H{"liked": true, "likeCount": comment.LikeCount + 1})
}

// GetUserPosts 获取用户的帖子
func (h *CommunityHandler) GetUserPosts(c *gin.Context) {
	userIDStr := c.Param("userId")
	userID, _ := strconv.ParseUint(userIDStr, 10, 32)

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "20"))

	var posts []models.CommunityPost
	var total int64

	database.DB.Model(&models.CommunityPost{}).Where("user_id = ? AND status >= ?", userID, 1).Count(&total)
	database.DB.Where("user_id = ? AND status >= ?", userID, 1).Order("created_at desc").Limit(pageSize).Offset((page - 1) * pageSize).Find(&posts)

	response.PageSuccess(c, posts, total, page, pageSize)
}

// GetUserBadges 获取用户勋章
func (h *CommunityHandler) GetUserBadges(c *gin.Context) {
	userIDStr := c.Param("userId")
	userID, _ := strconv.ParseUint(userIDStr, 10, 32)

	var badges []models.UserBadge
	database.DB.Where("user_id = ?", userID).Find(&badges)

	response.Success(c, badges)
}

// AwardBadge 授予勋章（管理员）
func (h *CommunityHandler) AwardBadge(c *gin.Context) {
	role := request.GetRole(c)
	if role != "admin" {
		response.Forbidden(c, "无权限")
		return
	}

	var req struct {
		UserID      uint   `json:"userId" binding:"required"`
		BadgeType   string `json:"badgeType" binding:"required"`
		BadgeName   string `json:"badgeName" binding:"required"`
		BadgeIcon   string `json:"badgeIcon"`
		Description string `json:"description"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	badge := models.UserBadge{
		UserID:      req.UserID,
		BadgeType:   req.BadgeType,
		BadgeName:   req.BadgeName,
		BadgeIcon:   req.BadgeIcon,
		Description: req.Description,
	}

	if err := database.DB.Create(&badge).Error; err != nil {
		response.InternalError(c, "授予失败")
		return
	}

	response.Success(c, &badge)
}