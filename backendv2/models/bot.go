package models

import (
	"errors"
	"time"

	"golang.org/x/crypto/bcrypt"
)

// Bot represents a robot with multiple cockpits.
type Bot struct {
	ID           int       `db:"id" json:"id"`
	Name         string    `db:"name" json:"name"`
	Token        string    `db:"token" json:"token"`
	ImageURL     string    `db:"image_url" json:"imageUrl"`
	AdminID      int       `db:"admin_id" json:"adminId"`
	isActive     bool  `db:"is_active" json:"isActive"`
	CreatedAt    time.Time `db:"created_at json:"createdAt"`
	Cockpits     []Cockpit `json:"cockpits,omitempty"`
	PasswordHash string    `gorm:"not null"`
}

type Botmethods interface {
	SetPassword(password string) error
}

type BotRequest struct {
	BotName  string    `json:"botName"`
	Password string    `json:"password"`
	Cockpit  []Cockpit `json:"cockpits" gorm:"foreignKey:BotID"`
}

type Publicbot struct {
	ID       int       `gorm:"primaryKey" json:"id"`
	Name     string    `json:"name"`
	Cockpits []Cockpit `gorm:"foreignKey:PublicbotID" json:"cockpits"`
	ImageURL string    `json:"imageUrl"`
	Image    string    `json:"image"`
	CreatedAt time.Time `json:"createdAt"`
}

func (b *Bot) SetPassword(password string) error {
	if len(password) < 8 {
		return errors.New("password must be at least characters")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)

	if err != nil {
		return err
	}

	b.PasswordHash = string(hashedPassword)

	return nil
}
