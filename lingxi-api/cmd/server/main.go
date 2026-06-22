package main

import (
	"fmt"
	"log"
	"os"
	"os/signal"
	"syscall"

	"lingxi-api/internal/config"
	"lingxi-api/internal/database"
	"lingxi-api/internal/router"
	"lingxi-api/pkg/auth"
	"lingxi-api/pkg/cache"

	"github.com/gin-gonic/gin"
)

func main() {
	// 加载配置
	cfg := config.Load()
	fmt.Println("灵犀命理平台API服务启动...")
	fmt.Printf("端口: %s\n", cfg.Server.Port)
	fmt.Printf("数据库: %s\n", cfg.Database.Path)

	// 初始化数据库
	if err := database.Init(cfg); err != nil {
		log.Fatalf("数据库初始化失败: %v", err)
	}
	fmt.Println("数据库初始化成功")

	// 初始化缓存
	cache.Init(cfg.Cache.Size)
	fmt.Println("缓存初始化成功")

	// 初始化JWT
	auth.Init(cfg)
	fmt.Println("JWT初始化成功")

	// 设置Gin模式
	gin.SetMode(gin.ReleaseMode)

	// 创建路由
	r := router.SetupRouter(cfg)

	// 启动服务器
	go func() {
		if err := r.Run(":" + cfg.Server.Port); err != nil {
			log.Fatalf("服务器启动失败: %v", err)
		}
	}()

	fmt.Printf("服务器已启动，监听端口 %s\n", cfg.Server.Port)
	fmt.Println("API文档: http://localhost:" + cfg.Server.Port + "/api/health")

	// 等待中断信号
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit

	fmt.Println("正在关闭服务器...")

	// 关闭数据库连接
	if err := database.Close(); err != nil {
		log.Printf("关闭数据库失败: %v", err)
	}

	fmt.Println("服务器已关闭")
}