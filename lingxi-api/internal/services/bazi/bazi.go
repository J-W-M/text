package bazi

import (
	"fmt"
	"time"
)

// Pillar 四柱
type Pillar struct {
	TianGan string `json:"tianGan"` // 天干
	DiZhi  string `json:"diZhi"`  // 地支
}

// BaZi 八字
type BaZi struct {
	YearPillar  Pillar `json:"yearPillar"`  // 年柱
	MonthPillar Pillar `json:"monthPillar"` // 月柱
	DayPillar   Pillar `json:"dayPillar"`   // 日柱
	HourPillar  Pillar `json:"hourPillar"`  // 时柱
}

// WuXingAnalysis 五行分析
type WuXingAnalysis struct {
	Element string `json:"element"` // 五行
	Count   int    `json:"count"`   // 数量
	Percent string `json:"percent"` // 百分比
}

// ShiShenAnalysis 十神分析
type ShiShenAnalysis struct {
	Name  string `json:"name"`  // 十神名称
	Count int    `json:"count"` // 数量
}

// DaYun 大运
type DaYun struct {
	Age       int    `json:"age"`       // 起运年龄
	Pillar    Pillar `json:"pillar"`    // 大运柱
	Direction string `json:"direction"` // 顺逆
}

// LiuNian 流年
type LiuNian struct {
	Year   int    `json:"year"`   // 年份
	Pillar Pillar `json:"pillar"` // 流年柱
}

// BaZiResult 八字排盘结果
type BaZiResult struct {
	BaZi           BaZi             `json:"baZi"`           // 八字
	NaYin         []string         `json:"naYin"`          // 纳音
	WuXing        []WuXingAnalysis `json:"wuXing"`        // 五行分析
	ShiShen       []ShiShenAnalysis `json:"shiShen"`     // 十神分析
	DaYun         []DaYun          `json:"daYun"`         // 大运
	LiuNian       []LiuNian        `json:"liuNian"`       // 流年
	DayMaster     string           `json:"dayMaster"`     // 日主
	DayMasterWX   string           `json:"dayMasterWX"`   // 日主五行
	Gender        int              `json:"gender"`        // 性别
	BirthDate     string           `json:"birthDate"`     // 出生时间
}

// 计算年柱
func GetYearPillar(year int) Pillar {
	// 年柱计算：以立春为界
	// 简化算法：(year - 4) % 60 得到干支序号
	offset := (year - 4) % 60
	if offset < 0 {
		offset += 60
	}
	ganIndex := offset % 10
	zhiIndex := offset % 12
	return Pillar{
		TianGan: TianGan[ganIndex],
		DiZhi:  DiZhi[zhiIndex],
	}
}

// 计算月柱
func GetMonthPillar(year, month int, isBeforeJieQi bool) Pillar {
	// 月柱计算
	// 年干决定月干
	yearPillar := GetYearPillar(year)
	yearGanIndex := getTianGanIndex(yearPillar.TianGan)

	// 月支：寅月为正月，依次类推
	// 如果在节气前，月份减1
	monthZhiIndex := (month + 1) % 12 // 寅=1月
	if isBeforeJieQi {
		monthZhiIndex = (monthZhiIndex + 11) % 12
	}

	// 月干：根据年干推算
	// 甲己之年丙作首，乙庚之岁戊为头
	// 丙辛之岁庚寅上，丁壬壬寅顺行流
	// 戊癸之岁甲寅首
	monthGanBase := []int{2, 4, 6, 8, 0} // 丙、戊、庚、壬、甲
	monthGanIndex := (monthGanBase[yearGanIndex%5] + monthZhiIndex) % 10

	return Pillar{
		TianGan: TianGan[monthGanIndex],
		DiZhi:  DiZhi[monthZhiIndex],
	}
}

// 计算日柱
func GetDayPillar(year, month, day int) Pillar {
	// 日柱计算：使用公式法
	// 基准日：1900年1月1日为甲戌日（干支序号10）
	baseDate := time.Date(1900, 1, 1, 0, 0, 0, 0, time.UTC)
	targetDate := time.Date(year, time.Month(month), day, 0, 0, 0, 0, time.UTC)

	days := int(targetDate.Sub(baseDate).Hours() / 24)
	offset := (days + 10) % 60
	if offset < 0 {
		offset += 60
	}

	ganIndex := offset % 10
	zhiIndex := offset % 12

	return Pillar{
		TianGan: TianGan[ganIndex],
		DiZhi:  DiZhi[zhiIndex],
	}
}

// 计算时柱
func GetHourPillar(dayGan string, hour int) Pillar {
	// 时柱计算
	// 时支：子时(23-1)、丑时(1-3)、寅时(3-5)...
	hourZhiIndex := ((hour + 1) / 2) % 12

	// 时干：根据日干推算
	// 甲己还加甲，乙庚丙作初
	// 丙辛从戊起，丁壬庚子居
	// 戊癸何方发，壬子是真途
	dayGanIndex := getTianGanIndex(dayGan)
	hourGanBase := []int{0, 2, 4, 6, 8} // 甲、丙、戊、庚、壬
	hourGanIndex := (hourGanBase[dayGanIndex%5] + hourZhiIndex) % 10

	return Pillar{
		TianGan: TianGan[hourGanIndex],
		DiZhi:  DiZhi[hourZhiIndex],
	}
}

// 八字排盘
func PaiPan(year, month, day, hour, minute int, gender int) *BaZiResult {
	// 简化处理：不考虑节气精确时间
	// 实际应用中需要根据节气判断月柱
	isBeforeJieQi := false

	// 计算四柱
	yearPillar := GetYearPillar(year)
	monthPillar := GetMonthPillar(year, month, isBeforeJieQi)
	dayPillar := GetDayPillar(year, month, day)
	hourPillar := GetHourPillar(dayPillar.TianGan, hour)

	baZi := BaZi{
		YearPillar:  yearPillar,
		MonthPillar: monthPillar,
		DayPillar:   dayPillar,
		HourPillar:  hourPillar,
	}

	// 计算纳音
	naYin := getNaYin(baZi)

	// 五行分析
	wuXing := analyzeWuXing(baZi)

	// 十神分析
	shiShen := analyzeShiShen(baZi)

	// 大运
	daYun := calculateDaYun(baZi, gender, year)

	// 流年（未来10年）
	liuNian := calculateLiuNian(year, 10)

	// 日主
	dayMaster := dayPillar.TianGan
	dayMasterWX := TianGanWuXing[dayMaster]

	return &BaZiResult{
		BaZi:         baZi,
		NaYin:        naYin,
		WuXing:       wuXing,
		ShiShen:      shiShen,
		DaYun:        daYun,
		LiuNian:      liuNian,
		DayMaster:    dayMaster,
		DayMasterWX:  dayMasterWX,
		Gender:       gender,
		BirthDate:    formatBirthDate(year, month, day, hour, minute),
	}
}

// 五行分析
func analyzeWuXing(baZi BaZi) []WuXingAnalysis {
	counts := make(map[string]int)

	// 统计天干五行
	counts[TianGanWuXing[baZi.YearPillar.TianGan]]++
	counts[TianGanWuXing[baZi.MonthPillar.TianGan]]++
	counts[TianGanWuXing[baZi.DayPillar.TianGan]]++
	counts[TianGanWuXing[baZi.HourPillar.TianGan]]++

	// 统计地支五行
	counts[DiZhiWuXing[baZi.YearPillar.DiZhi]]++
	counts[DiZhiWuXing[baZi.MonthPillar.DiZhi]]++
	counts[DiZhiWuXing[baZi.DayPillar.DiZhi]]++
	counts[DiZhiWuXing[baZi.HourPillar.DiZhi]]++

	// 统计藏干五行
	for _, pillar := range []Pillar{baZi.YearPillar, baZi.MonthPillar, baZi.DayPillar, baZi.HourPillar} {
		if cangGan, ok := DiZhiCangGan[pillar.DiZhi]; ok {
			for _, gan := range cangGan {
				counts[TianGanWuXing[gan]]++ // 藏干计入
			}
		}
	}

	total := 8.0 // 四柱共8个字
	result := make([]WuXingAnalysis, 0, 5)
	for _, wx := range WuXing {
		count := counts[wx]
		percent := float64(count) / total * 100
		result = append(result, WuXingAnalysis{
			Element: wx,
			Count:   count,
			Percent: fmt.Sprintf("%.1f%%", percent),
		})
	}

	return result
}

// 十神分析
func analyzeShiShen(baZi BaZi) []ShiShenAnalysis {
	dayMaster := baZi.DayPillar.TianGan
	dayMasterWX := TianGanWuXing[dayMaster]
	dayMasterYY := TianGanYinYang[dayMaster]

	counts := make(map[string]int)

	// 分析其他七个字的十神
	analyzePillar := func(pillar Pillar, isDayPillar bool) {
		if isDayPillar {
			// 日柱天干是日主本身
			return
		}

		// 天干十神
		gan := pillar.TianGan
		ss := getShiShen(dayMasterWX, dayMasterYY, TianGanWuXing[gan], TianGanYinYang[gan])
		counts[ss]++

		// 地支藏干十神
		if cangGan, ok := DiZhiCangGan[pillar.DiZhi]; ok {
			for _, cg := range cangGan {
				ss := getShiShen(dayMasterWX, dayMasterYY, TianGanWuXing[cg], TianGanYinYang[cg])
				counts[ss]++
			}
		}
	}

	analyzePillar(baZi.YearPillar, false)
	analyzePillar(baZi.MonthPillar, false)
	analyzePillar(baZi.DayPillar, true)
	analyzePillar(baZi.HourPillar, false)

	result := make([]ShiShenAnalysis, 0, 10)
	for _, ss := range ShiShen {
		result = append(result, ShiShenAnalysis{
			Name:  ss,
			Count: counts[ss],
		})
	}

	return result
}

// 获取十神
func getShiShen(dayWX, dayYY, targetWX, targetYY string) string {
	// 十神计算规则
	// 同我者为比劫（比肩、劫财）
	// 我生者为食伤（食神、伤官）
	// 我克者为财星（偏财、正财）
	// 克我者为官杀（七杀、正官）
	// 生我者为印星（偏印、正印）

	if targetWX == dayWX {
		// 同我者
		if targetYY == dayYY {
			return "比肩"
		}
		return "劫财"
	}

	// 我生者
	if WuXingSheng[dayWX] == targetWX {
		if targetYY == dayYY {
			return "食神"
		}
		return "伤官"
	}

	// 我克者
	if WuXingKe[dayWX] == targetWX {
		if targetYY == dayYY {
			return "偏财"
		}
		return "正财"
	}

	// 克我者
	if WuXingKe[targetWX] == dayWX {
		if targetYY == dayYY {
			return "七杀"
		}
		return "正官"
	}

	// 生我者
	if WuXingSheng[targetWX] == dayWX {
		if targetYY == dayYY {
			return "偏印"
		}
		return "正印"
	}

	return ""
}

// 计算大运
func calculateDaYun(baZi BaZi, gender, year int) []DaYun {
	// 大运计算规则
	// 阳男阴女顺行，阴男阳女逆行
	// 起运年龄：根据出生日期到下一个节气的天数计算
	// 简化处理：假设起运年龄为8岁

	dayMasterYY := TianGanYinYang[baZi.DayPillar.TianGan]
	isShun := (dayMasterYY == "阳" && gender == 1) || (dayMasterYY == "阴" && gender == 2)

	// 月柱作为大运起点
	monthGanIndex := getTianGanIndex(baZi.MonthPillar.TianGan)
	monthZhiIndex := getDiZhiIndex(baZi.MonthPillar.DiZhi)

	daYun := make([]DaYun, 0, 8)
	startAge := 8

	for i := 0; i < 8; i++ {
		var ganIndex, zhiIndex int
		if isShun {
			ganIndex = (monthGanIndex + i + 1) % 10
			zhiIndex = (monthZhiIndex + i + 1) % 12
		} else {
			ganIndex = (monthGanIndex - i - 1 + 10) % 10
			zhiIndex = (monthZhiIndex - i - 1 + 12) % 12
		}

		direction := "顺行"
		if !isShun {
			direction = "逆行"
		}

		daYun = append(daYun, DaYun{
			Age:       startAge + i*10,
			Pillar:    Pillar{TianGan: TianGan[ganIndex], DiZhi: DiZhi[zhiIndex]},
			Direction: direction,
		})
	}

	return daYun
}

// 计算流年
func calculateLiuNian(startYear, count int) []LiuNian {
	result := make([]LiuNian, 0, count)
	for i := 0; i < count; i++ {
		year := startYear + i
		pillar := GetYearPillar(year)
		result = append(result, LiuNian{
			Year:   year,
			Pillar: pillar,
		})
	}
	return result
}

// 获取纳音
func getNaYin(baZi BaZi) []string {
	result := make([]string, 0, 4)

	pillars := []Pillar{baZi.YearPillar, baZi.MonthPillar, baZi.DayPillar, baZi.HourPillar}
	for _, pillar := range pillars {
		// 计算干支序号
		ganIndex := getTianGanIndex(pillar.TianGan)
		zhiIndex := getDiZhiIndex(pillar.DiZhi)
		naYinIndex := (ganIndex%10)*2 + (zhiIndex%12)/2
		if naYinIndex >= 30 {
			naYinIndex = naYinIndex % 30
		}

		for _, ny := range NaYin {
			if ny[0] == pillar.TianGan+pillar.DiZhi {
				result = append(result, ny[1])
				break
			}
		}
	}

	return result
}

// 辅助函数
func getTianGanIndex(gan string) int {
	for i, g := range TianGan {
		if g == gan {
			return i
		}
	}
	return 0
}

func getDiZhiIndex(zhi string) int {
	for i, z := range DiZhi {
		if z == zhi {
			return i
		}
	}
	return 0
}

func formatBirthDate(year, month, day, hour, minute int) string {
	return fmt.Sprintf("%d年%d月%d日 %02d:%02d", year, month, day, hour, minute)
}

// 计算五行强弱
func GetWuXingStrength(baZi BaZi) map[string]string {
	counts := make(map[string]int)

	// 统计
	counts[TianGanWuXing[baZi.YearPillar.TianGan]]++
	counts[TianGanWuXing[baZi.MonthPillar.TianGan]]++
	counts[TianGanWuXing[baZi.DayPillar.TianGan]]++
	counts[TianGanWuXing[baZi.HourPillar.TianGan]]++
	counts[DiZhiWuXing[baZi.YearPillar.DiZhi]]++
	counts[DiZhiWuXing[baZi.MonthPillar.DiZhi]]++
	counts[DiZhiWuXing[baZi.DayPillar.DiZhi]]++
	counts[DiZhiWuXing[baZi.HourPillar.DiZhi]]++

	result := make(map[string]string)
	for _, wx := range WuXing {
		count := counts[wx]
		if count >= 3 {
			result[wx] = "旺"
		} else if count >= 2 {
			result[wx] = "相"
		} else if count == 1 {
			result[wx] = "休"
		} else {
			result[wx] = "囚"
		}
	}

	return result
}

// 判断日主强弱
func GetDayMasterStrength(baZi BaZi) string {
	dayMasterWX := TianGanWuXing[baZi.DayPillar.TianGan]

	// 统计帮扶日主的五行
	helpCount := 0
	// 同我（比劫）
	helpCount += countWuXing(baZi, dayMasterWX)
	// 生我（印星）
	shengWX := ""
	for wx, target := range WuXingSheng {
		if target == dayMasterWX {
			shengWX = wx
			break
		}
	}
	helpCount += countWuXing(baZi, shengWX)

	if helpCount >= 4 {
		return "身旺"
	} else if helpCount >= 2 {
		return "中和"
	}
	return "身弱"
}

func countWuXing(baZi BaZi, targetWX string) int {
	count := 0
	if TianGanWuXing[baZi.YearPillar.TianGan] == targetWX {
		count++
	}
	if TianGanWuXing[baZi.MonthPillar.TianGan] == targetWX {
		count++
	}
	if TianGanWuXing[baZi.HourPillar.TianGan] == targetWX {
		count++
	}
	if DiZhiWuXing[baZi.YearPillar.DiZhi] == targetWX {
		count++
	}
	if DiZhiWuXing[baZi.MonthPillar.DiZhi] == targetWX {
		count++
	}
	if DiZhiWuXing[baZi.DayPillar.DiZhi] == targetWX {
		count++
	}
	if DiZhiWuXing[baZi.HourPillar.DiZhi] == targetWX {
		count++
	}
	return count
}