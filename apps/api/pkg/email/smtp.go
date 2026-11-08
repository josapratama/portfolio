package email

import (
	"crypto/tls"
	"fmt"
	"net/smtp"
	"strings"

	"github.com/alexdev/portfolio/config"
)

type Mailer struct {
	cfg *config.Config
}

func New() *Mailer {
	return &Mailer{cfg: config.Cfg}
}

type Message struct {
	To      string
	Subject string
	Body    string
	IsHTML  bool
}

// Send sends an email via SMTP
func (m *Mailer) Send(msg Message) error {
	if m.cfg.SMTPUser == "" || m.cfg.SMTPPassword == "" {
		return fmt.Errorf("SMTP credentials not configured")
	}

	from := m.cfg.SMTPFrom
	if m.cfg.SMTPFromName != "" {
		from = fmt.Sprintf("%s <%s>", m.cfg.SMTPFromName, m.cfg.SMTPFrom)
	}

	contentType := "text/plain"
	if msg.IsHTML {
		contentType = "text/html"
	}

	body := strings.Join([]string{
		fmt.Sprintf("From: %s", from),
		fmt.Sprintf("To: %s", msg.To),
		fmt.Sprintf("Subject: %s", msg.Subject),
		fmt.Sprintf("MIME-Version: 1.0"),
		fmt.Sprintf("Content-Type: %s; charset=utf-8", contentType),
		"",
		msg.Body,
	}, "\r\n")

	auth := smtp.PlainAuth("", m.cfg.SMTPUser, m.cfg.SMTPPassword, m.cfg.SMTPHost)
	addr := fmt.Sprintf("%s:%d", m.cfg.SMTPHost, m.cfg.SMTPPort)

	// Use STARTTLS
	tlsConfig := &tls.Config{
		ServerName: m.cfg.SMTPHost,
	}

	conn, err := tls.Dial("tcp", addr, tlsConfig)
	if err != nil {
		// Fallback to plain SMTP with STARTTLS upgrade
		return smtp.SendMail(addr, auth, m.cfg.SMTPFrom, []string{msg.To}, []byte(body))
	}
	defer conn.Close()

	client, err := smtp.NewClient(conn, m.cfg.SMTPHost)
	if err != nil {
		return err
	}
	defer client.Close()

	if err = client.Auth(auth); err != nil {
		return err
	}
	if err = client.Mail(m.cfg.SMTPFrom); err != nil {
		return err
	}
	if err = client.Rcpt(msg.To); err != nil {
		return err
	}

	w, err := client.Data()
	if err != nil {
		return err
	}
	_, err = fmt.Fprint(w, body)
	if err != nil {
		return err
	}
	return w.Close()
}

// SendContactNotification sends a formatted contact form notification
func (m *Mailer) SendContactNotification(to, name, fromEmail, subject, message string) error {
	body := fmt.Sprintf(`
New Contact Form Submission
============================

Name:    %s
Email:   %s
Subject: %s

Message:
--------
%s

---
This message was sent via your portfolio contact form.
`, name, fromEmail, subject, message)

	return m.Send(Message{
		To:      to,
		Subject: fmt.Sprintf("[Portfolio Contact] %s", subject),
		Body:    body,
		IsHTML:  false,
	})
}
