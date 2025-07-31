package email

import (
	"bytes"
	"crypto/rand"
	"fmt"
	"os"
	"text/template"

	"github.com/mailjet/mailjet-apiv3-go/v3"
)

type EmailService struct {
	client *mailjet.Client
	from   string
	name   string
}

type EmailConfirmationData struct {
	ConfirmationCode string
}

func NewEmailService() (*EmailService, error) {
	apiKey := os.Getenv("MAILJET_API_KEY")
	apiSecret := os.Getenv("MAILJET_API_SECRET")
	fromEmail := os.Getenv("MAILJET_FROM_EMAIL")
	fromName := os.Getenv("MAILJET_FROM_NAME")

	if apiKey == "" || apiSecret == "" || fromEmail == "" || fromName == "" {
		return nil, fmt.Errorf("missing required email configuration")
	}

	client := mailjet.NewMailjetClient(apiKey, apiSecret)
	return &EmailService{
		client: client,
		from:   fromEmail,
		name:   fromName,
	}, nil
}

func (s *EmailService) SendConfirmationEmail(toEmail, confirmationCode string) error {
	tmpl, err := template.New("confirmation").Parse(EmailConfirmationTemplate)
	if err != nil {
		return fmt.Errorf("failed to parse email template: %v", err)
	}

	var buf bytes.Buffer
	data := EmailConfirmationData{ConfirmationCode: confirmationCode}
	if err := tmpl.Execute(&buf, data); err != nil {
		return fmt.Errorf("failed to execute template: %v", err)
	}

	messagesInfo := []mailjet.InfoMessagesV31{
		{
			From: &mailjet.RecipientV31{
				Email: "gav@robotanium.com",
				Name:  s.name,
			},
			To: &mailjet.RecipientsV31{
				mailjet.RecipientV31{
					Email: toEmail,
				},
			},
			Subject:  "Confirm Your Email Address",
			TextPart: fmt.Sprintf("Your confirmation code is: %s", confirmationCode),
			HTMLPart: buf.String(),
		},
	}

	messages := mailjet.MessagesV31{Info: messagesInfo}
	_, err = s.client.SendMailV31(&messages)
	if err != nil {
		return fmt.Errorf("failed to send email: %v", err)
	}

	return nil
}

// Generate a random 6-digit code as a string
func generateSixDigitCode() (string, error) {
	var digits [6]byte
	_, err := rand.Read(digits[:])
	if err != nil {
		return "", err
	}
	for i := 0; i < 6; i++ {
		digits[i] = (digits[i] % 10) + '0'
	}
	return string(digits[:]), nil
} 