package external

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/smtp"
	"time"
)

// SMSService 短信服务接口
type SMSService interface {
	Send(phone, content string) error
	SendVerifyCode(phone, code string) error
}

// EmailService 邮件服务接口
type EmailService interface {
	Send(to, subject, body string) error
	SendVerifyCode(to, code string) error
}

// MockSMSService 模拟短信服务(用于开发测试)
type MockSMSService struct{}

func NewMockSMSService() *MockSMSService {
	return &MockSMSService{}
}

func (s *MockSMSService) Send(phone, content string) error {
	// 模拟发送短信
	fmt.Printf("[SMS Mock] Sending to %s: %s\n", phone, content)
	return nil
}

func (s *MockSMSService) SendVerifyCode(phone, code string) error {
	return s.Send(phone, fmt.Sprintf("您的验证码是：%s，有效期5分钟。", code))
}

// AliyunSMSService 阿里云短信服务
type AliyunSMSService struct {
	AccessKeyID     string
	AccessKeySecret string
	SignName        string
	TemplateCode    string
	Client          *http.Client
}

func NewAliyunSMSService(accessKeyID, accessKeySecret, signName, templateCode string) *AliyunSMSService {
	return &AliyunSMSService{
		AccessKeyID:     accessKeyID,
		AccessKeySecret: accessKeySecret,
		SignName:        signName,
		TemplateCode:    templateCode,
		Client: &http.Client{
			Timeout: 10 * time.Second,
		},
	}
}

func (s *AliyunSMSService) Send(phone, content string) error {
	// TODO: 实现阿里云短信API调用
	// 需要添加阿里云短信SDK或自行实现API签名
	return fmt.Errorf("aliyun SMS not implemented")
}

func (s *AliyunSMSService) SendVerifyCode(phone, code string) error {
	// TODO: 使用模板发送验证码
	return s.Send(phone, code)
}

// SMTPEmailService SMTP邮件服务
type SMTPEmailService struct {
	Host     string
	Port     int
	Username string
	Password string
	From     string
}

func NewSMTPEmailService(host string, port int, username, password, from string) *SMTPEmailService {
	return &SMTPEmailService{
		Host:     host,
		Port:     port,
		Username: username,
		Password: password,
		From:     from,
	}
}

func (s *SMTPEmailService) Send(to, subject, body string) error {
	auth := smtp.PlainAuth("", s.Username, s.Password, s.Host)

	msg := fmt.Sprintf("From: %s\r\n", s.From)
	msg += fmt.Sprintf("To: %s\r\n", to)
	msg += fmt.Sprintf("Subject: %s\r\n", subject)
	msg += "MIME-version: 1.0;\r\nContent-Type: text/html; charset=\"UTF-8\";\r\n\r\n"
	msg += body

	addr := fmt.Sprintf("%s:%d", s.Host, s.Port)
	return smtp.SendMail(addr, auth, s.From, []string{to}, []byte(msg))
}

func (s *SMTPEmailService) SendVerifyCode(to, code string) error {
	subject := "灵犀命理 - 验证码"
	body := fmt.Sprintf(`
		<html>
		<body>
			<h2>灵犀命理</h2>
			<p>您的验证码是：<strong>%s</strong></p>
			<p>验证码有效期5分钟，请尽快使用。</p>
		</body>
		</html>
	`, code)
	return s.Send(to, subject, body)
}

// MockEmailService 模拟邮件服务(用于开发测试)
type MockEmailService struct{}

func NewMockEmailService() *MockEmailService {
	return &MockEmailService{}
}

func (s *MockEmailService) Send(to, subject, body string) error {
	fmt.Printf("[Email Mock] Sending to %s, Subject: %s\n", to, subject)
	return nil
}

func (s *MockEmailService) SendVerifyCode(to, code string) error {
	return s.Send(to, "验证码", fmt.Sprintf("您的验证码是：%s", code))
}

// HTTPClient 通用HTTP客户端
type HTTPClient struct {
	Client *http.Client
}

func NewHTTPClient(timeout time.Duration) *HTTPClient {
	return &HTTPClient{
		Client: &http.Client{
			Timeout: timeout,
		},
	}
}

func (c *HTTPClient) Get(url string, headers map[string]string) ([]byte, error) {
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	for k, v := range headers {
		req.Header.Set(k, v)
	}

	resp, err := c.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	return io.ReadAll(resp.Body)
}

func (c *HTTPClient) Post(url string, headers map[string]string, body interface{}) ([]byte, error) {
	var bodyReader io.Reader
	if body != nil {
		data, err := json.Marshal(body)
		if err != nil {
			return nil, err
		}
		bodyReader = bytes.NewReader(data)
	}

	req, err := http.NewRequest("POST", url, bodyReader)
	if err != nil {
		return nil, err
	}

	for k, v := range headers {
		req.Header.Set(k, v)
	}
	if body != nil {
		req.Header.Set("Content-Type", "application/json")
	}

	resp, err := c.Client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	return io.ReadAll(resp.Body)
}