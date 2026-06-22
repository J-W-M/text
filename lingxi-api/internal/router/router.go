package router

import (
	"lingxi-api/internal/config"
	"lingxi-api/internal/handlers"
	"lingxi-api/internal/middleware/request"

	"github.com/gin-gonic/gin"
)

func SetupRouter(cfg *config.Config) *gin.Engine {
	r := gin.New()

	// 使用中间件
	r.Use(request.Recovery())
	r.Use(request.Logger())
	r.Use(request.CORS())

	// 初始化处理器
	authHandler := handlers.NewAuthHandler()
	birthInfoHandler := handlers.NewBirthInfoHandler()
	baziHandler := handlers.NewBaziHandler()
	chatHandler := handlers.NewChatHandler(cfg)
	reportHandler := handlers.NewReportHandler(cfg)
	communityHandler := handlers.NewCommunityHandler()

	// API路由组
	api := r.Group("/api")
	{
		// 认证相关（不需要登录）
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
			auth.POST("/refresh", request.Auth(), authHandler.RefreshToken)
		}

		// 需要登录的路由
		authorized := api.Group("")
		authorized.Use(request.Auth())
		{
			// 用户相关
			authorized.POST("/auth/logout", authHandler.Logout)
			authorized.GET("/user/me", authHandler.GetCurrentUser)
			authorized.PUT("/user/me", authHandler.UpdateUser)
			authorized.PUT("/user/password", authHandler.ChangePassword)

			// 生辰信息
			authorized.POST("/birth-info", birthInfoHandler.CreateBirthInfo)
			authorized.GET("/birth-info", birthInfoHandler.GetBirthInfoList)
			authorized.GET("/birth-info/:id", birthInfoHandler.GetBirthInfo)
			authorized.PUT("/birth-info/:id", birthInfoHandler.UpdateBirthInfo)
			authorized.DELETE("/birth-info/:id", birthInfoHandler.DeleteBirthInfo)
			authorized.PUT("/birth-info/:id/default", birthInfoHandler.SetDefaultBirthInfo)

			// 八字计算
			authorized.POST("/bazi/calculate", baziHandler.BaziCalculate)
			authorized.GET("/bazi/calculate", baziHandler.BaziCalculateByParams)
			authorized.POST("/bazi/wuxing", baziHandler.WuXingAnalyze)
			authorized.POST("/bazi/shishen", baziHandler.ShiShenAnalyze)
			authorized.POST("/bazi/dayun", baziHandler.DaYunAnalyze)

			// AI对话
			authorized.POST("/chat/send", chatHandler.SendMessage)
			authorized.POST("/chat/bazi", chatHandler.BaziChat)
			authorized.GET("/chat/session/:sessionId", chatHandler.GetChatHistory)
			authorized.GET("/chat/sessions", chatHandler.GetChatSessionList)
			authorized.DELETE("/chat/session/:sessionId", chatHandler.DeleteChatSession)

			// 命理报告
			authorized.POST("/report/generate", reportHandler.GenerateReport)
			authorized.GET("/reports", reportHandler.GetReportList)
			authorized.GET("/report/:reportId", reportHandler.GetReport)
			authorized.DELETE("/report/:reportId", reportHandler.DeleteReport)
		}

		// 社区功能（部分需要登录）
		community := api.Group("/community")
		{
			// 公开接口
			community.GET("/posts", communityHandler.GetPostList)
			community.GET("/post/:postId", request.OptionalAuth(), communityHandler.GetPost)
			community.GET("/user/:userId/posts", communityHandler.GetUserPosts)
			community.GET("/user/:userId/badges", communityHandler.GetUserBadges)

			// 需要登录
			community.POST("/post", request.Auth(), communityHandler.CreatePost)
			community.DELETE("/post/:postId", request.Auth(), communityHandler.DeletePost)
			community.POST("/post/:postId/like", request.Auth(), communityHandler.LikePost)
			community.POST("/post/:postId/comment", request.Auth(), communityHandler.CreateComment)
			community.DELETE("/comment/:commentId", request.Auth(), communityHandler.DeleteComment)
			community.POST("/comment/:commentId/like", request.Auth(), communityHandler.LikeComment)

			// 管理员
			community.POST("/badge", request.Auth(), request.AdminOnly(), communityHandler.AwardBadge)
		}

		// 健康检查
		api.GET("/health", func(c *gin.Context) {
			c.JSON(200, gin.H{
				"status":  "ok",
				"message": "灵犀命理平台API服务运行正常",
			})
		})
	}

	return r
}