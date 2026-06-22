package handlers

import (
	"fmt"
	"strconv"

	"lingxi-api/internal/config"
	"lingxi-api/internal/database"
	"lingxi-api/internal/models"
	"lingxi-api/internal/middleware/external"
	"lingxi-api/internal/middleware/request"
	"lingxi-api/internal/services/bazi"
	"lingxi-api/pkg/response"

	"github.com/gin-gonic/gin"
)

var aiService external.AIService

// ChatHandler 对话处理器
type ChatHandler struct{}

func NewChatHandler(cfg *config.Config) *ChatHandler {
	aiService = external.NewOpenAIService(cfg.AI.APIKey, cfg.AI.BaseURL, cfg.AI.Model)
	return &ChatHandler{}
}

// SendMessageRequest 发送消息请求
type SendMessageRequest struct {
	SessionID uint   `json:"sessionId"`
	Content   string `json:"content" binding:"required"`
	Type      string `json:"type"` // general, bazi, fortune
}

// SendMessage 发送消息
func (h *ChatHandler) SendMessage(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	var req SendMessageRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	// 如果没有sessionId，创建新会话
	var session models.ChatSession
	if req.SessionID == 0 {
		session = models.ChatSession{
			UserID: userID,
			Title:  "新对话",
			Type:   req.Type,
			Status: 1,
		}
		if err := database.DB.Create(&session).Error; err != nil {
			response.InternalError(c, "创建会话失败")
			return
		}
		req.SessionID = session.ID
	} else {
		// 验证会话归属
		if err := database.DB.Where("id = ? AND user_id = ?", req.SessionID, userID).First(&session).Error; err != nil {
			response.NotFound(c, "会话不存在")
			return
		}
	}

	// 保存用户消息
	userMessage := models.ChatMessage{
		SessionID: req.SessionID,
		Role:      "user",
		Content:   req.Content,
	}
	if err := database.DB.Create(&userMessage).Error; err != nil {
		response.InternalError(c, "保存消息失败")
		return
	}

	// 获取历史消息
	var historyMessages []models.ChatMessage
	database.DB.Where("session_id = ?", req.SessionID).Order("created_at asc").Find(&historyMessages)

	// 构建AI消息
	aiMessages := make([]external.ChatMessage, 0, len(historyMessages)+1)
	for _, msg := range historyMessages {
		aiMessages = append(aiMessages, external.ChatMessage{
			Role:    msg.Role,
			Content: msg.Content,
		})
	}

	// 构建系统提示词
	systemPrompt := buildSystemPrompt(req.Type, userID)

	// 调用AI服务
	aiReply, err := aiService.ChatWithSystem(systemPrompt, aiMessages)
	if err != nil {
		// 如果AI服务失败，返回模拟回复
		aiReply = "抱歉，AI服务暂时不可用。请稍后再试。"
	}

	// 保存AI回复
	assistantMessage := models.ChatMessage{
		SessionID: req.SessionID,
		Role:      "assistant",
		Content:   aiReply,
	}
	if err := database.DB.Create(&assistantMessage).Error; err != nil {
		response.InternalError(c, "保存回复失败")
		return
	}

	// 更新会话标题（如果是第一条消息）
	if len(historyMessages) == 0 {
		title := req.Content
		if len(title) > 20 {
			title = title[:20] + "..."
		}
		database.DB.Model(&session).Update("title", title)
	}

	response.Success(c, gin.H{
		"sessionId":  req.SessionID,
		"userMessage": userMessage,
		"aiMessage":  assistantMessage,
	})
}

// 构建系统提示词
func buildSystemPrompt(chatType string, userID uint) string {
	basePrompt := "你是灵犀命理平台的AI助手，精通中国传统命理学，包括八字命理、五行学说、十神理论、大运流年等。你能够根据用户的生辰八字进行命理分析，提供专业的命理解读和建议。"

	switch chatType {
	case "bazi":
		return basePrompt + "\n\n当前对话专注于八字命理分析。请根据用户提供的生辰信息，进行详细的八字排盘分析，包括五行分析、十神分析、大运流年推演等。"
	case "fortune":
		return basePrompt + "\n\n当前对话专注于运势分析。请根据用户的八字信息，分析其当前运势、未来发展趋势，并提供相应的建议。"
	default:
		return basePrompt + "\n\n请友好、专业地回答用户的问题，提供有价值的命理知识和建议。"
	}
}

// GetChatHistory 获取对话历史
func (h *ChatHandler) GetChatHistory(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	sessionIDStr := c.Param("sessionId")
	sessionID, _ := strconv.ParseUint(sessionIDStr, 10, 32)

	// 验证会话归属
	var session models.ChatSession
	if err := database.DB.Where("id = ? AND user_id = ?", sessionID, userID).First(&session).Error; err != nil {
		response.NotFound(c, "会话不存在")
		return
	}

	var messages []models.ChatMessage
	database.DB.Where("session_id = ?", sessionID).Order("created_at asc").Find(&messages)

	response.Success(c, gin.H{
		"session":  session,
		"messages": messages,
	})
}

// GetChatSessionList 获取会话列表
func (h *ChatHandler) GetChatSessionList(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "20"))

	var sessions []models.ChatSession
	var total int64

	database.DB.Model(&models.ChatSession{}).Where("user_id = ?", userID).Count(&total)
	database.DB.Where("user_id = ?", userID).Order("updated_at desc").Limit(pageSize).Offset((page - 1) * pageSize).Find(&sessions)

	response.PageSuccess(c, sessions, total, page, pageSize)
}

// DeleteChatSession 删除会话
func (h *ChatHandler) DeleteChatSession(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	sessionIDStr := c.Param("sessionId")
	sessionID, _ := strconv.ParseUint(sessionIDStr, 10, 32)

	// 验证会话归属
	var session models.ChatSession
	if err := database.DB.Where("id = ? AND user_id = ?", sessionID, userID).First(&session).Error; err != nil {
		response.NotFound(c, "会话不存在")
		return
	}

	// 删除会话和消息
	database.DB.Where("session_id = ?", sessionID).Delete(&models.ChatMessage{})
	database.DB.Delete(&session)

	response.SuccessWithMessage(c, "删除成功", nil)
}

// BaziChat 八字命理对话
func (h *ChatHandler) BaziChat(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	var req struct {
		SessionID   uint `json:"sessionId"`
		BirthInfoID uint `json:"birthInfoId" binding:"required"`
		Content     string `json:"content" binding:"required"`
	}

	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	// 获取生辰信息
	var birthInfo models.BirthInfo
	if err := database.DB.Where("id = ? AND user_id = ?", req.BirthInfoID, userID).First(&birthInfo).Error; err != nil {
		response.NotFound(c, "生辰信息不存在")
		return
	}

	// 计算八字
	baziResult := bazi.PaiPan(
		birthInfo.BirthYear,
		birthInfo.BirthMonth,
		birthInfo.BirthDay,
		birthInfo.BirthHour,
		birthInfo.BirthMinute,
		birthInfo.Gender,
	)

	// 如果没有sessionId，创建新会话
	var session models.ChatSession
	if req.SessionID == 0 {
		session = models.ChatSession{
			UserID: userID,
			Title:  fmt.Sprintf("%s的八字分析", birthInfo.Name),
			Type:   "bazi",
			Status: 1,
		}
		if err := database.DB.Create(&session).Error; err != nil {
			response.InternalError(c, "创建会话失败")
			return
		}
		req.SessionID = session.ID
	} else {
		if err := database.DB.Where("id = ? AND user_id = ?", req.SessionID, userID).First(&session).Error; err != nil {
			response.NotFound(c, "会话不存在")
			return
		}
	}

	// 保存用户消息
	userMessage := models.ChatMessage{
		SessionID: req.SessionID,
		Role:      "user",
		Content:   req.Content,
	}
	database.DB.Create(&userMessage)

	// 构建八字上下文
	genderStr := "女"
	if birthInfo.Gender == 1 {
		genderStr = "男"
	}
	baziContext := fmt.Sprintf(`
生辰信息：
姓名：%s
性别：%s
出生时间：%d年%d月%d日 %02d:%02d

八字排盘：
年柱：%s%s
月柱：%s%s
日柱：%s%s（日主）
时柱：%s%s

五行分析：
%s

日主五行：%s
`,
		birthInfo.Name,
		genderStr,
		birthInfo.BirthYear, birthInfo.BirthMonth, birthInfo.BirthDay, birthInfo.BirthHour, birthInfo.BirthMinute,
		baziResult.BaZi.YearPillar.TianGan, baziResult.BaZi.YearPillar.DiZhi,
		baziResult.BaZi.MonthPillar.TianGan, baziResult.BaZi.MonthPillar.DiZhi,
		baziResult.BaZi.DayPillar.TianGan, baziResult.BaZi.DayPillar.DiZhi,
		baziResult.BaZi.HourPillar.TianGan, baziResult.BaZi.HourPillar.DiZhi,
		formatWuXingAnalysis(baziResult.WuXing),
		baziResult.DayMasterWX,
	)

	// 构建系统提示词
	systemPrompt := buildSystemPrompt("bazi", userID) + "\n\n当前分析的八字信息如下：\n" + baziContext

	// 获取历史消息
	var historyMessages []models.ChatMessage
	database.DB.Where("session_id = ?", req.SessionID).Order("created_at asc").Find(&historyMessages)

	aiMessages := make([]external.ChatMessage, 0, len(historyMessages)+1)
	for _, msg := range historyMessages {
		aiMessages = append(aiMessages, external.ChatMessage{
			Role:    msg.Role,
			Content: msg.Content,
		})
	}

	// 调用AI
	aiReply, err := aiService.ChatWithSystem(systemPrompt, aiMessages)
	if err != nil {
		aiReply = "抱歉，AI服务暂时不可用。"
	}

	// 保存AI回复
	assistantMessage := models.ChatMessage{
		SessionID: req.SessionID,
		Role:      "assistant",
		Content:   aiReply,
	}
	database.DB.Create(&assistantMessage)

	response.Success(c, gin.H{
		"sessionId":   req.SessionID,
		"userMessage": userMessage,
		"aiMessage":   assistantMessage,
		"baziResult":  baziResult,
	})
}

func formatWuXingAnalysis(wuXing []bazi.WuXingAnalysis) string {
	result := ""
	for _, wx := range wuXing {
		result += fmt.Sprintf("%s: %d个 (%s) ", wx.Element, wx.Count, wx.Percent)
	}
	return result
}