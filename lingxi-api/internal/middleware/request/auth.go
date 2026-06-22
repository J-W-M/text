package request

import (
	"lingxi-api/pkg/auth"
	"lingxi-api/pkg/response"
	"strings"

	"github.com/gin-gonic/gin"
)

func Auth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			response.Unauthorized(c, "请先登录")
			c.Abort()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) != 2 || parts[0] != "Bearer" {
			response.Unauthorized(c, "Token格式错误")
			c.Abort()
			return
		}

		claims, err := auth.ParseToken(parts[1])
		if err != nil {
			response.Unauthorized(c, "Token无效或已过期")
			c.Abort()
			return
		}

		// 将用户信息存入上下文
		c.Set("userId", claims.UserID)
		c.Set("username", claims.Username)
		c.Set("role", claims.Role)
		c.Set("token", parts[1])

		c.Next()
	}
}

func OptionalAuth() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" {
			c.Next()
			return
		}

		parts := strings.SplitN(authHeader, " ", 2)
		if len(parts) == 2 && parts[0] == "Bearer" {
			claims, err := auth.ParseToken(parts[1])
			if err == nil {
				c.Set("userId", claims.UserID)
				c.Set("username", claims.Username)
				c.Set("role", claims.Role)
				c.Set("token", parts[1])
			}
		}

		c.Next()
	}
}

func AdminOnly() gin.HandlerFunc {
	return func(c *gin.Context) {
		role, exists := c.Get("role")
		if !exists || role != "admin" {
			response.Forbidden(c, "无权限访问")
			c.Abort()
			return
		}
		c.Next()
	}
}

func GetUserID(c *gin.Context) uint {
	if userID, exists := c.Get("userId"); exists {
		return userID.(uint)
	}
	return 0
}

func GetUsername(c *gin.Context) string {
	if username, exists := c.Get("username"); exists {
		return username.(string)
	}
	return ""
}

func GetRole(c *gin.Context) string {
	if role, exists := c.Get("role"); exists {
		return role.(string)
	}
	return ""
}