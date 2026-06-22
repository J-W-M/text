package config

import (
	"os"
	"strconv"
)

type Config struct {
	Server   ServerConfig
	Database DatabaseConfig
	JWT      JWTConfig
	AI       AIConfig
	Cache    CacheConfig
}

type ServerConfig struct {
	Port string
}

type DatabaseConfig struct {
	Path string
}

type JWTConfig struct {
	Secret     string
	ExpireTime int64 // hours
}

type AIConfig struct {
	APIKey  string
	BaseURL string
	Model   string
}

type CacheConfig struct {
	Size int // bytes
}

func Load() *Config {
	return &Config{
		Server: ServerConfig{
			Port: getEnv("API_PORT", "8080"),
		},
		Database: DatabaseConfig{
			Path: getEnv("DB_PATH", "./data/lingxi.db"),
		},
		JWT: JWTConfig{
			Secret:     getEnv("JWT_SECRET", "lingxi-secret-key-change-in-production"),
			ExpireTime: getEnvAsInt64("JWT_EXPIRE_HOURS", 24*7), // 7 days
		},
		AI: AIConfig{
			APIKey:  getEnv("AI_API_KEY", ""),
			BaseURL: getEnv("AI_BASE_URL", "https://api.openai.com/v1"),
			Model:   getEnv("AI_MODEL", "gpt-3.5-turbo"),
		},
		Cache: CacheConfig{
			Size: getEnvAsInt("CACHE_SIZE", 100*1024*1024), // 100MB
		},
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}

func getEnvAsInt(key string, defaultValue int) int {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.Atoi(value); err == nil {
			return intVal
		}
	}
	return defaultValue
}

func getEnvAsInt64(key string, defaultValue int64) int64 {
	if value := os.Getenv(key); value != "" {
		if intVal, err := strconv.ParseInt(value, 10, 64); err == nil {
			return intVal
		}
	}
	return defaultValue
}