package handlers

import (
	"strconv"

	"lingxi-api/internal/database"
	"lingxi-api/internal/models"
	"lingxi-api/internal/middleware/request"
	"lingxi-api/internal/services/bazi"
	"lingxi-api/pkg/response"

	"github.com/gin-gonic/gin"
)

// BaziHandler 八字处理器
type BaziHandler struct{}

func NewBaziHandler() *BaziHandler {
	return &BaziHandler{}
}

// BaziCalculateRequest 八字计算请求
type BaziCalculateRequest struct {
	BirthInfoID uint `json:"birthInfoId" binding:"required"`
}

// BaziCalculate 八字排盘计算
func (h *BaziHandler) BaziCalculate(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	var req BaziCalculateRequest
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
	result := bazi.PaiPan(
		birthInfo.BirthYear,
		birthInfo.BirthMonth,
		birthInfo.BirthDay,
		birthInfo.BirthHour,
		birthInfo.BirthMinute,
		birthInfo.Gender,
	)

	response.Success(c, result)
}

// BaziCalculateByParams 直接通过参数计算八字
func (h *BaziHandler) BaziCalculateByParams(c *gin.Context) {
	yearStr := c.Query("year")
	monthStr := c.Query("month")
	dayStr := c.Query("day")
	hourStr := c.Query("hour")
	minuteStr := c.Query("minute")
	genderStr := c.Query("gender")

	if yearStr == "" || monthStr == "" || dayStr == "" || hourStr == "" || genderStr == "" {
		response.BadRequest(c, "缺少必要参数")
		return
	}

	year, _ := strconv.Atoi(yearStr)
	month, _ := strconv.Atoi(monthStr)
	day, _ := strconv.Atoi(dayStr)
	hour, _ := strconv.Atoi(hourStr)
	minute, _ := strconv.Atoi(minuteStr)
	gender, _ := strconv.Atoi(genderStr)

	if month < 1 || month > 12 || day < 1 || day > 31 || hour < 0 || hour > 23 || gender < 1 || gender > 2 {
		response.BadRequest(c, "参数值不合法")
		return
	}

	result := bazi.PaiPan(year, month, day, hour, minute, gender)
	response.Success(c, result)
}

// WuXingAnalyze 五行分析
func (h *BaziHandler) WuXingAnalyze(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	var req BaziCalculateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	var birthInfo models.BirthInfo
	if err := database.DB.Where("id = ? AND user_id = ?", req.BirthInfoID, userID).First(&birthInfo).Error; err != nil {
		response.NotFound(c, "生辰信息不存在")
		return
	}

	result := bazi.PaiPan(
		birthInfo.BirthYear,
		birthInfo.BirthMonth,
		birthInfo.BirthDay,
		birthInfo.BirthHour,
		birthInfo.BirthMinute,
		birthInfo.Gender,
	)

	// 五行强弱分析
	wuXingStrength := bazi.GetWuXingStrength(result.BaZi)
	// 日主强弱
	dayMasterStrength := bazi.GetDayMasterStrength(result.BaZi)

	response.Success(c, gin.H{
		"wuXing":          result.WuXing,
		"wuXingStrength":  wuXingStrength,
		"dayMaster":       result.DayMaster,
		"dayMasterWX":     result.DayMasterWX,
		"dayMasterStrength": dayMasterStrength,
	})
}

// ShiShenAnalyze 十神分析
func (h *BaziHandler) ShiShenAnalyze(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	var req BaziCalculateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	var birthInfo models.BirthInfo
	if err := database.DB.Where("id = ? AND user_id = ?", req.BirthInfoID, userID).First(&birthInfo).Error; err != nil {
		response.NotFound(c, "生辰信息不存在")
		return
	}

	result := bazi.PaiPan(
		birthInfo.BirthYear,
		birthInfo.BirthMonth,
		birthInfo.BirthDay,
		birthInfo.BirthHour,
		birthInfo.BirthMinute,
		birthInfo.Gender,
	)

	response.Success(c, gin.H{
		"shiShen":   result.ShiShen,
		"dayMaster": result.DayMaster,
		"baZi":      result.BaZi,
	})
}

// DaYunAnalyze 大运分析
func (h *BaziHandler) DaYunAnalyze(c *gin.Context) {
	userID := request.GetUserID(c)
	if userID == 0 {
		response.Unauthorized(c, "请先登录")
		return
	}

	var req BaziCalculateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		response.BadRequest(c, "参数错误: "+err.Error())
		return
	}

	var birthInfo models.BirthInfo
	if err := database.DB.Where("id = ? AND user_id = ?", req.BirthInfoID, userID).First(&birthInfo).Error; err != nil {
		response.NotFound(c, "生辰信息不存在")
		return
	}

	result := bazi.PaiPan(
		birthInfo.BirthYear,
		birthInfo.BirthMonth,
		birthInfo.BirthDay,
		birthInfo.BirthHour,
		birthInfo.BirthMinute,
		birthInfo.Gender,
	)

	response.Success(c, gin.H{
		"daYun":     result.DaYun,
		"liuNian":   result.LiuNian,
		"baZi":      result.BaZi,
		"birthYear": birthInfo.BirthYear,
	})
}