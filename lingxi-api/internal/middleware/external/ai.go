package external

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"time"
)

// AIService AI服务接口
type AIService interface {
	Chat(messages []ChatMessage) (string, error)
	ChatWithSystem(systemPrompt string, messages []ChatMessage) (string, error)
}

// ChatMessage 聊天消息
type ChatMessage struct {
	Role    string `json:"role"`    // system, user, assistant
	Content string `json:"content"`
}

// OpenAIService OpenAI兼容服务
type OpenAIService struct {
	APIKey  string
	BaseURL string
	Model   string
	Client  *http.Client
}

type openAIRequest struct {
	Model    string          `json:"model"`
	Messages []openAIMessage `json:"messages"`
}

type openAIMessage struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type openAIResponse struct {
	ID      string `json:"id"`
	Object  string `json:"object"`
	Created int64  `json:"created"`
	Model   string `json:"model"`
	Choices []struct {
		Index   int `json:"index"`
		Message struct {
			Role    string `json:"role"`
			Content string `json:"content"`
		} `json:"message"`
		FinishReason string `json:"finish_reason"`
	} `json:"choices"`
	Usage struct {
		PromptTokens     int `json:"prompt_tokens"`
		CompletionTokens int `json:"completion_tokens"`
		TotalTokens      int `json:"total_tokens"`
	} `json:"usage"`
	Error *struct {
		Message string `json:"message"`
		Type    string `json:"type"`
		Code    string `json:"code"`
	} `json:"error,omitempty"`
}

func NewOpenAIService(apiKey, baseURL, model string) *OpenAIService {
	return &OpenAIService{
		APIKey:  apiKey,
		BaseURL: baseURL,
		Model:   model,
		Client: &http.Client{
			Timeout: 60 * time.Second,
		},
	}
}

func (s *OpenAIService) Chat(messages []ChatMessage) (string, error) {
	return s.ChatWithSystem("", messages)
}

func (s *OpenAIService) ChatWithSystem(systemPrompt string, messages []ChatMessage) (string, error) {
	// 构建请求消息
	openAIMessages := make([]openAIMessage, 0, len(messages)+1)

	if systemPrompt != "" {
		openAIMessages = append(openAIMessages, openAIMessage{
			Role:    "system",
			Content: systemPrompt,
		})
	}

	for _, msg := range messages {
		openAIMessages = append(openAIMessages, openAIMessage{
			Role:    msg.Role,
			Content: msg.Content,
		})
	}

	req := openAIRequest{
		Model:    s.Model,
		Messages: openAIMessages,
	}

	body, err := json.Marshal(req)
	if err != nil {
		return "", fmt.Errorf("failed to marshal request: %w", err)
	}

	httpReq, err := http.NewRequest("POST", s.BaseURL+"/chat/completions", bytes.NewReader(body))
	if err != nil {
		return "", fmt.Errorf("failed to create request: %w", err)
	}

	httpReq.Header.Set("Content-Type", "application/json")
	httpReq.Header.Set("Authorization", "Bearer "+s.APIKey)

	resp, err := s.Client.Do(httpReq)
	if err != nil {
		return "", fmt.Errorf("failed to send request: %w", err)
	}
	defer resp.Body.Close()

	respBody, err := io.ReadAll(resp.Body)
	if err != nil {
		return "", fmt.Errorf("failed to read response: %w", err)
	}

	var openAIResp openAIResponse
	if err := json.Unmarshal(respBody, &openAIResp); err != nil {
		return "", fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if openAIResp.Error != nil {
		return "", fmt.Errorf("API error: %s", openAIResp.Error.Message)
	}

	if len(openAIResp.Choices) == 0 {
		return "", fmt.Errorf("no response from AI")
	}

	return openAIResp.Choices[0].Message.Content, nil
}