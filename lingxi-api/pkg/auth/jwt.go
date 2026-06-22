package auth

import (
	"errors"
	"time"

	"lingxi-api/internal/config"

	"github.com/golang-jwt/jwt/v5"
)

var jwtSecret []byte

type Claims struct {
	UserID   uint   `json:"userId"`
	Username string `json:"username"`
	Role     string `json:"role"`
	jwt.RegisteredClaims
}

func Init(cfg *config.Config) {
	jwtSecret = []byte(cfg.JWT.Secret)
}

func GenerateToken(userID uint, username, role string) (string, error) {
	claims := Claims{
		UserID:   userID,
		Username: username,
		Role:     role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(24 * 7 * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
			NotBefore: jwt.NewNumericDate(time.Now()),
			Issuer:    "lingxi-api",
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString(jwtSecret)
}

func ParseToken(tokenString string) (*Claims, error) {
	token, err := jwt.ParseWithClaims(tokenString, &Claims{}, func(token *jwt.Token) (interface{}, error) {
		return jwtSecret, nil
	})

	if err != nil {
		return nil, err
	}

	if claims, ok := token.Claims.(*Claims); ok && token.Valid {
		return claims, nil
	}

	return nil, errors.New("invalid token")
}

func RefreshToken(tokenString string) (string, error) {
	claims, err := ParseToken(tokenString)
	if err != nil {
		return "", err
	}

	return GenerateToken(claims.UserID, claims.Username, claims.Role)
}