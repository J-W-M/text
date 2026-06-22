package models

import (
	"time"

	"gorm.io/gorm"
)

// User 用户表
type User struct {
	ID           uint           `json:"id" gorm:"primaryKey"`
	Username     string         `json:"username" gorm:"uniqueIndex;size:50;not null"`
	Email        string         `json:"email" gorm:"uniqueIndex;size:100;not null"`
	Password     string         `json:"-" gorm:"size:255;not null"`
	Nickname     string         `json:"nickname" gorm:"size:50"`
	Avatar       string         `json:"avatar" gorm:"size:255"`
	Phone        string         `json:"phone" gorm:"size:20"`
	Bio          string         `json:"bio" gorm:"size:500"`
	Gender       int            `json:"gender" gorm:"default:0"` // 0:未知 1:男 2:女
	Birthday     *time.Time     `json:"birthday"`
	Role         string         `json:"role" gorm:"size:20;default:user"` // user, admin
	Status       int            `json:"status" gorm:"default:1"`          // 0:禁用 1:正常
	LastLoginAt  *time.Time     `json:"lastLoginAt"`
	LastLoginIP  string         `json:"lastLoginIp" gorm:"size:50"`
	CreatedAt    time.Time      `json:"createdAt"`
	UpdatedAt    time.Time      `json:"updatedAt"`
	DeletedAt    gorm.DeletedAt `json:"-" gorm:"index"`
}

// BirthInfo 生辰信息表
type BirthInfo struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	UserID      uint           `json:"userId" gorm:"index;not null"`
	Name        string         `json:"name" gorm:"size:50;not null"`
	Gender      int            `json:"gender" gorm:"not null"` // 1:男 2:女
	BirthYear   int            `json:"birthYear" gorm:"not null"`
	BirthMonth  int            `json:"birthMonth" gorm:"not null"`
	BirthDay    int            `json:"birthDay" gorm:"not null"`
	BirthHour   int            `json:"birthHour" gorm:"not null"` // 0-23
	BirthMinute int            `json:"birthMinute" gorm:"not null"`
	IsLunar     bool           `json:"isLunar"`                   // 是否农历
	Province    string         `json:"province" gorm:"size:50"`   // 省份
	City        string         `json:"city" gorm:"size:50"`       // 城市
	Longitude   float64        `json:"longitude"`                 // 经度
	Latitude    float64        `json:"latitude"`                  // 纬度
	Remark      string         `json:"remark" gorm:"size:500"`   // 备注
	IsDefault   bool           `json:"isDefault" gorm:"default:false"`
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

// ChatSession 对话会话表
type ChatSession struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	UserID    uint           `json:"userId" gorm:"index;not null"`
	Title     string         `json:"title" gorm:"size:100"`
	Type      string         `json:"type" gorm:"size:20;default:general"` // general, bazi, fortune
	Status    int            `json:"status" gorm:"default:1"`              // 0:关闭 1:进行中
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
	Messages  []ChatMessage  `json:"messages,omitempty" gorm:"foreignKey:SessionID"`
}

// ChatMessage 对话消息表
type ChatMessage struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	SessionID uint           `json:"sessionId" gorm:"index;not null"`
	Role      string         `json:"role" gorm:"size:20;not null"` // user, assistant
	Content   string         `json:"content" gorm:"type:text;not null"`
	CreatedAt time.Time      `json:"createdAt"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
}

// FortuneReport 命理报告表
type FortuneReport struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	UserID      uint           `json:"userId" gorm:"index;not null"`
	BirthInfoID uint           `json:"birthInfoId" gorm:"index;not null"`
	Title       string         `json:"title" gorm:"size:100;not null"`
	Type        string         `json:"type" gorm:"size:20;not null"` // bazi, fortune, marriage, career
	Content     string         `json:"content" gorm:"type:text"`
	Summary     string         `json:"summary" gorm:"type:text"`
	Status      int            `json:"status" gorm:"default:0"` // 0:生成中 1:完成 2:失败
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
}

// CommunityPost 社区帖子表
type CommunityPost struct {
	ID          uint           `json:"id" gorm:"primaryKey"`
	UserID      uint           `json:"userId" gorm:"index;not null"`
	Title       string         `json:"title" gorm:"size:100;not null"`
	Content     string         `json:"content" gorm:"type:text;not null"`
	Category    string         `json:"category" gorm:"size:20;default:general"` // general, bazi, fortune, question
	ViewCount   int            `json:"viewCount" gorm:"default:0"`
	LikeCount   int            `json:"likeCount" gorm:"default:0"`
	CommentCount int           `json:"commentCount" gorm:"default:0"`
	Status      int            `json:"status" gorm:"default:1"` // 0:隐藏 1:正常 2:置顶
	CreatedAt   time.Time      `json:"createdAt"`
	UpdatedAt   time.Time      `json:"updatedAt"`
	DeletedAt   gorm.DeletedAt `json:"-" gorm:"index"`
	User        *User          `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

// PostComment 帖子评论表
type PostComment struct {
	ID        uint           `json:"id" gorm:"primaryKey"`
	PostID    uint           `json:"postId" gorm:"index;not null"`
	UserID    uint           `json:"userId" gorm:"index;not null"`
	ParentID  uint           `json:"parentId" gorm:"default:0"` // 回复的评论ID，0表示一级评论
	Content   string         `json:"content" gorm:"type:text;not null"`
	LikeCount int            `json:"likeCount" gorm:"default:0"`
	Status    int            `json:"status" gorm:"default:1"` // 0:隐藏 1:正常
	CreatedAt time.Time      `json:"createdAt"`
	UpdatedAt time.Time      `json:"updatedAt"`
	DeletedAt gorm.DeletedAt `json:"-" gorm:"index"`
	User      *User          `json:"user,omitempty" gorm:"foreignKey:UserID"`
}

// PostLike 帖子点赞表
type PostLike struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	PostID    uint      `json:"postId" gorm:"index;not null"`
	UserID    uint      `json:"userId" gorm:"index;not null"`
	CreatedAt time.Time `json:"createdAt"`
}

// CommentLike 评论点赞表
type CommentLike struct {
	ID        uint      `json:"id" gorm:"primaryKey"`
	CommentID uint      `json:"commentId" gorm:"index;not null"`
	UserID    uint      `json:"userId" gorm:"index;not null"`
	CreatedAt time.Time `json:"createdAt"`
}

// UserBadge 用户勋章表
type UserBadge struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	UserID      uint      `json:"userId" gorm:"index;not null"`
	BadgeType   string    `json:"badgeType" gorm:"size:50;not null"` // badge类型：active, expert, contributor等
	BadgeName   string    `json:"badgeName" gorm:"size:50;not null"`
	BadgeIcon   string    `json:"badgeIcon" gorm:"size:255"`
	Description string    `json:"description" gorm:"size:200"`
	CreatedAt   time.Time `json:"createdAt"`
}