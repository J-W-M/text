package request

import (
	"lingxi-api/pkg/response"
	"net/http"
	"runtime/debug"

	"github.com/gin-gonic/gin"
)

func Recovery() gin.HandlerFunc {
	return func(c *gin.Context) {
		defer func() {
			if err := recover(); err != nil {
				// 记录错误日志
				gin.DefaultWriter.Write([]byte(
					"[PANIC RECOVERED] " + string(debug.Stack()) + "\n",
				))

				response.Error(c, http.StatusInternalServerError, "服务器内部错误")
				c.Abort()
			}
		}()
		c.Next()
	}
}