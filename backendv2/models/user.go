package models

import (
	"crypto/rand"
	"errors"
	"fmt"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type User struct {
	ID                 uint     `gorm:"primaryKey"`
	Email              string   `gorm:"uniqueIndex;not null"`
	Username           string   `gorm:"not null"`
	PasswordHash       string   `gorm:"not null"`
	IsRobotaniumAdmin  bool     `gorm:"default:false"`
	IsPlayerAdmin      bool     `gorm:"default:false"`
	IsActive           bool     `gorm:"default:true"`
	IsEmailVerified    bool     `gorm:"default:false"`
	AuthTokens         []string `gorm:"type:text[]"` // PostgreSQL array
	PasswordResetToken *string  `gorm:"type:varchar(255)"`
	RegistrationToken  *string  `gorm:"type:varchar(255)"`
	Theme              string   `gorm:"default:'dark'"`
	CreatedAt          time.Time
	UpdatedAt          time.Time
	DeletedAt          gorm.DeletedAt `gorm:"index"` // Soft delete
}

// Methods similar to your MongoDB schema
type UserMethods interface {
	GenerateAuthToken() (string, error)
	GetPublicProfile() map[string]interface{}
	GenerateConfirmEmailDto() (EmailConfirmationDto, error)
	ConfirmEmail(dto EmailConfirmationDto) (bool, error)
	SetPassword(password string) error
	CheckPassword(password string) bool
}

type EmailConfirmationDto struct {
	RegistrationToken       string
	Email                   string
	HashedRegistrationToken string
}

// Helper function for generating a 6-digit code
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

// BeforeSave hook - similar to your MongoDB pre-save
func (u *User) BeforeSave(tx *gorm.DB) error {
	// Password hashing is handled in SetPassword method
	return nil
}

// SetPassword - handles password hashing
func (u *User) SetPassword(password string) error {
	if len(password) < 8 {
		return errors.New("password must be at least 8 characters")
	}

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return err
	}

	u.PasswordHash = string(hashedPassword)
	return nil
}

// CheckPassword - verifies password
func (u *User) CheckPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.PasswordHash), []byte(password))
	return err == nil
}

// GenerateAuthToken - similar to your MongoDB method
func (u *User) GenerateAuthToken() (string, error) {
	token := jwt.New(jwt.SigningMethodHS256)
	claims := token.Claims.(jwt.MapClaims)
	claims["user_id"] = u.ID
	claims["exp"] = time.Now().Add(time.Hour * 24).Unix()

	// Get secret key from environment variable
	secretKey := os.Getenv("JWT_SECRET_KEY")
	if secretKey == "" {
		return "", errors.New("JWT_SECRET_KEY environment variable is not set")
	}

	tokenString, err := token.SignedString([]byte(secretKey))
	if err != nil {
		return "", err
	}

	// Clean up old tokens and add new one
	u.AuthTokens = append(u.AuthTokens, tokenString)
	return tokenString, nil
}

// GetPublicProfile - similar to your MongoDB method
func (u *User) GetPublicProfile() map[string]interface{} {
	return map[string]interface{}{
		"id":                u.ID,
		"email":             u.Email,
		"username":          u.Username,
		"isRobotaniumAdmin": u.IsRobotaniumAdmin,
		"isPlayerAdmin":     u.IsPlayerAdmin,
		"isActive":          u.IsActive,
		"isEmailVerified":   u.IsEmailVerified,
		"theme":             u.Theme,
	}
}

// GenerateConfirmEmailDto - similar to your MongoDB method
func (u *User) GenerateConfirmEmailDto() (EmailConfirmationDto, error) {
	code, err := generateSixDigitCode()
	if err != nil {
		return EmailConfirmationDto{}, err
	}

	hashedCode, err := bcrypt.GenerateFromPassword([]byte(code), bcrypt.DefaultCost)
	if err != nil {
		return EmailConfirmationDto{}, err
	}

	codeStr := string(hashedCode)
	u.RegistrationToken = &codeStr

	return EmailConfirmationDto{
		RegistrationToken:       code, // plain code for email
		Email:                   u.Email,
		HashedRegistrationToken: codeStr,
	}, nil
}

// ConfirmEmail - similar to your MongoDB method
func (u *User) ConfirmEmail(dto EmailConfirmationDto) (bool, error) {
	if u.RegistrationToken == nil {
		fmt.Println("ConfirmEmail error", "no registration token found")
		return false, errors.New("no registration token found")
	}

	fmt.Println("ConfirmEmail", *u.RegistrationToken, dto.RegistrationToken)

	if err := bcrypt.CompareHashAndPassword([]byte(*u.RegistrationToken), []byte(dto.RegistrationToken)); err != nil {
		fmt.Println("ConfirmEmail error", err)
		return false, err
	}

	u.IsEmailVerified = true
	u.RegistrationToken = nil
	return true, nil
}

// GetUserByEmail retrieves a user by their email address
func GetUserByEmail(db *gorm.DB, email string) (*User, error) {
	var user User
	result := db.Where("email = ?", email).First(&user)
	if result.Error != nil {
		return nil, result.Error
	}
	return &user, nil
}
