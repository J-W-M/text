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

// ReportHandler 命理报告处理器
type ReportHandler struct {
	aiService external.AIService
}

func NewReportHandler(cfg *config.Config) *ReportHandler {
	return &ReportHandler{
		aiService: external.NewOpenAIService(cfg.AI.APIKey, cfg.AI.BaseURL, cfg.AI.Model),
	}
}

// GenerateReportRequest 生成报告请求
type GenerateReportRequest struct {
	BirthInfoID uint   `json:"birthInfoId" binding:"required"`
	Type        string `json:"type" binding:"required"` // bazi, fortune, marriage, career
}

// GenerateReport 生成命理报告
func (h *ReportHandler) GenerateReport(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	var req GenerateReportRequest
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

	// 创建报告记录（状态为生成中）
	report := models.FortuneReport{
		UserID:      userID,
		BirthInfoID: req.BirthInfoID,
		Title:       fmt.Sprintf("%s的%s报告", birthInfo.Name, getReportTypeName(req.Type)),
		Type:        req.Type,
		Status:      0, // 生成中
	}
	database.DB.Create(&report)

	// 构建报告内容
	baziContext := buildBaziContext(birthInfo, baziResult)
	systemPrompt := buildReportSystemPrompt(req.Type)
	userPrompt := fmt.Sprintf("请根据以下八字信息，生成一份详细的%s报告：\n\n%s", getReportTypeName(req.Type), baziContext)

	// 调用AI生成报告
	aiMessages := []external.ChatMessage{
		{Role: "user", Content: userPrompt},
	}

	reportContent, err := h.aiService.ChatWithSystem(systemPrompt, aiMessages)
	if err != nil {
		// 如果AI失败，生成模拟报告
		reportContent = generateMockReport(req.Type, birthInfo, baziResult)
	}

	// 更新报告状态
	database.DB.Model(&report).Updates(map[string]interface{}{
		"content":   reportContent,
		"summary":   generateSummary(reportContent),
		"status":    1, // 完成
	})

	response.Success(c, gin.H{
		"reportId": report.ID,
		"status":   "生成完成",
	})
}

// GetReportList 获取报告列表
func (h *ReportHandler) GetReportList(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	pageSize, _ := strconv.Atoi(c.DefaultQuery("pageSize", "10"))
	reportType := c.Query("type")

	var reports []models.FortuneReport
	var total int64

	query := database.DB.Model(&models.FortuneReport{}).Where("user_id = ?", userID)
	if reportType != "" {
		query = query.Where("type = ?", reportType)
	}

	query.Count(&total)
	query.Order("created_at desc").Limit(pageSize).Offset((page - 1) * pageSize).Find(&reports)

	response.PageSuccess(c, reports, total, page, pageSize)
}

// GetReport 获取报告详情
func (h *ReportHandler) GetReport(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	reportIDStr := c.Param("reportId")
	reportID, _ := strconv.ParseUint(reportIDStr, 10, 32)

	var report models.FortuneReport
	if err := database.DB.Where("id = ? AND user_id = ?", reportID, userID).First(&report).Error; err != nil {
		response.NotFound(c, "报告不存在")
		return
	}

	// 获取生辰信息
	var birthInfo models.BirthInfo
	database.DB.First(&birthInfo, report.BirthInfoID)

	response.Success(c, gin.H{
		"report":    report,
		"birthInfo": birthInfo,
	})
}

// DeleteReport 删除报告
func (h *ReportHandler) DeleteReport(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	reportIDStr := c.Param("reportId")
	reportID, _ := strconv.ParseUint(reportIDStr, 10, 32)

	result := database.DB.Where("id = ? AND user_id = ?", reportID, userID).Delete(&models.FortuneReport{})
	if result.Error != nil {
		response.InternalError(c, "删除失败")
		return
	}

	if result.RowsAffected == 0 {
		response.NotFound(c, "报告不存在")
		return
	}

	response.SuccessWithMessage(c, "删除成功", nil)
}

func getReportTypeName(reportType string) string {
	switch reportType {
	case "bazi":
		return "八字命理"
	case "fortune":
		return "运势分析"
	case "marriage":
		return "婚姻感情"
	case "career":
		return "事业财运"
	default:
		return "命理"
	}
}

func buildBaziContext(birthInfo models.BirthInfo, baziResult *bazi.BaZiResult) string {
	genderStr := "女"
	if birthInfo.Gender == 1 {
		genderStr = "男"
	}
	return fmt.Sprintf(`
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

日主：%s
日主五行：%s
日主强弱：%s

大运：
%s
`,
		birthInfo.Name,
		genderStr,
		birthInfo.BirthYear, birthInfo.BirthMonth, birthInfo.BirthDay, birthInfo.BirthHour, birthInfo.BirthMinute,
		baziResult.BaZi.YearPillar.TianGan, baziResult.BaZi.YearPillar.DiZhi,
		baziResult.BaZi.MonthPillar.TianGan, baziResult.BaZi.MonthPillar.DiZhi,
		baziResult.BaZi.DayPillar.TianGan, baziResult.BaZi.DayPillar.DiZhi,
		baziResult.BaZi.HourPillar.TianGan, baziResult.BaZi.HourPillar.DiZhi,
		formatWuXingAnalysis(baziResult.WuXing),
		baziResult.DayMaster,
		baziResult.DayMasterWX,
		bazi.GetDayMasterStrength(baziResult.BaZi),
		formatDaYun(baziResult.DaYun),
	)
}

func buildReportSystemPrompt(reportType string) string {
	basePrompt := "你是灵犀命理平台的专业命理分析师，精通八字命理、五行学说、十神理论等中国传统命理学。"

	switch reportType {
	case "bazi":
		return basePrompt + "\n\n请根据用户的八字信息，生成一份详细的八字命理分析报告，包括：\n1. 八字排盘解读\n2. 五行分析\n3. 十神分析\n4. 日主强弱分析\n5. 性格特点\n6. 建议与注意事项"
	case "fortune":
		return basePrompt + "\n\n请根据用户的八字信息，生成一份详细的运势分析报告，包括：\n1. 当前运势分析\n2. 大运流年分析\n3. 近期运势预测\n4. 财运分析\n5. 建议与注意事项"
	case "marriage":
		return basePrompt + "\n\n请根据用户的八字信息，生成一份详细的婚姻感情分析报告，包括：\n1. 婚姻运势分析\n2. 配偶特征\n3. 感情建议\n4. 注意事项"
	case "career":
		return basePrompt + "\n\n请根据用户的八字信息，生成一份详细的事业财运分析报告，包括：\n1. 事业运势分析\n2. 适合行业\n3. 财运分析\n4. 发展建议"
	default:
		return basePrompt + "\n\n请根据用户的八字信息，生成一份详细的命理分析报告。"
	}
}

func generateMockReport(reportType string, birthInfo models.BirthInfo, baziResult *bazi.BaZiResult) string {
	genderStr := "女"
	if birthInfo.Gender == 1 {
		genderStr = "男"
	}
	return fmt.Sprintf(`
# %s的%s报告

## 基本信息
- 姓名：%s
- 性别：%s
- 出生时间：%d年%d月%d日 %02d:%02d

## 八字排盘
年柱：%s%s  月柱：%s%s  日柱：%s%s  时柱：%s%s

## 五行分析
%s

## 日主分析
日主：%s，五行属%s，%s

## 大运分析
%s

## 综合建议
根据八字分析，建议在日常生活中注意五行平衡，把握运势起伏，顺势而为。

---
*本报告由灵犀命理平台AI生成，仅供参考*
`,
		birthInfo.Name, getReportTypeName(reportType),
		birthInfo.Name,
		genderStr,
		birthInfo.BirthYear, birthInfo.BirthMonth, birthInfo.BirthDay, birthInfo.BirthHour, birthInfo.BirthMinute,
		baziResult.BaZi.YearPillar.TianGan, baziResult.BaZi.YearPillar.DiZhi,
		baziResult.BaZi.MonthPillar.TianGan, baziResult.BaZi.MonthPillar.DiZhi,
		baziResult.BaZi.DayPillar.TianGan, baziResult.BaZi.DayPillar.DiZhi,
		baziResult.BaZi.HourPillar.TianGan, baziResult.BaZi.HourPillar.DiZhi,
		formatWuXingAnalysis(baziResult.WuXing),
		baziResult.DayMaster, baziResult.DayMasterWX, bazi.GetDayMasterStrength(baziResult.BaZi),
		formatDaYun(baziResult.DaYun),
	)
}

func generateSummary(content string) string {
	if len(content) > 200 {
		return content[:200] + "..."
	}
	return content
}

func formatDaYun(daYun []bazi.DaYun) string {
	result := ""
	for _, dy := range daYun {
		result += fmt.Sprintf("%d岁：%s%s (%s) ", dy.Age, dy.Pillar.TianGan, dy.Pillar.DiZhi, dy.Direction)
	}
	return result
}