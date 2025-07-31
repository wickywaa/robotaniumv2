package controllers

import (
	"backendv2/models"
	"backendv2/pkg/database"
	"backendv2/pkg/email"
	"fmt"

	"github.com/go-playground/validator/v10"
	"github.com/gofiber/fiber/v2"
)

var validate = validator.New()

func LoginUser(c *fiber.Ctx) error {
	type LoginRequest struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}
	fmt.Println("LoginUser called")

	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	db := database.GetDB()
	var user models.User
	if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	if !user.CheckPassword(req.Password) {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Invalid credentials"})
	}

	token, err := user.GenerateAuthToken()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not generate token"})
	}

	return c.JSON(fiber.Map{
		"token": token,
		"user":  user.GetPublicProfile(),
	})
}

func GetUser(c *fiber.Ctx) error {
	id := c.Params("id")
	fmt.Printf("Got request for user ID: %s\n", id)

	// Check if the user exists in the context
	userInterface := c.Locals("user")
	if userInterface == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	// Get the authenticated user from the context
	authenticatedUser, ok := userInterface.(models.User)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Invalid user data in context",
		})
	}

	// You can now use the authenticated user information
	fmt.Printf("Request made by authenticated user: %s (ID: %d)\n", authenticatedUser.Username, authenticatedUser.ID)

	return c.JSON(fiber.Map{
		"user":               "John Doe",
		"authenticated_user": authenticatedUser.GetPublicProfile(),
	})
}

func GetUsers(c *fiber.Ctx) error {
	fmt.Println("Getting users")
	userInterface := c.Locals("user")
	if userInterface == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authenticated",
		})
	}

	authenticatedUser, ok := userInterface.(models.User)
	if !ok {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Invalid user data in context",
		})
	}

	if !authenticatedUser.IsRobotaniumAdmin {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not authorized",
		})
	}

	users := []models.User{}
	db := database.GetDB()
	if err := db.Find(&users).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch users",
		})
	}

	publicUsers := make([]fiber.Map, len(users))
	for i, user := range users {
		publicUsers[i] = user.GetPublicProfile()
	}

	return c.JSON(fiber.Map{
		"users": publicUsers,
	})
}

func CreateUser(c *fiber.Ctx) error {
	type CreateUserRequest struct {
		Email    string `json:"email" validate:"required,email"`
		Password string `json:"password" validate:"required,min=6"`
	}

	fmt.Println("Creating user")
	var req CreateUserRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request format"})
	}

	// Validate the request
	if err := validate.Struct(req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid input data"})
	}

	// Create the user in database
	db := database.GetDB()
	user := models.User{
		Email: req.Email,
	}

	// Set the password using the model's method
	if err := user.SetPassword(req.Password); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Failed to set password"})
	}

	// Generate registration token
	emailConfirmationDto, err := user.GenerateConfirmEmailDto()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate registration token"})
	}

	// Initialize email service
	emailService, err := email.NewEmailService()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to initialize email service"})
	}

	// Send confirmation email
	if err := emailService.SendConfirmationEmail(req.Email, emailConfirmationDto.RegistrationToken); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to send confirmation email"})
	}

	user.RegistrationToken = &emailConfirmationDto.HashedRegistrationToken

	if err := db.Create(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to create user"})
	}

	fmt.Println("User added:", user)

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "User created successfully. Please check your email for confirmation.",
		"user":    user.GetPublicProfile(),
	})
}

func ConfirmEmail(c *fiber.Ctx) error {
	type ConfirmRequest struct {
		Email             string `json:"email"`
		RegistrationToken string `json:"registrationToken"`
	}

	var req ConfirmRequest
	if err := c.BodyParser(&req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	fmt.Println("ConfirmEmail called", req.Email, req.RegistrationToken)

	db := database.GetDB()
	var user models.User
	if err := db.Where("email = ?", req.Email).First(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	dto := models.EmailConfirmationDto{
		RegistrationToken: req.RegistrationToken,
		Email:             req.Email,
	}

	ok, err := user.ConfirmEmail(dto)
	if err != nil || !ok {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid or expired code"})
	}

	// Save the updated user (email verified, token cleared)
	if err := db.Save(&user).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to update user"})
	}

	return c.JSON(fiber.Map{
		"message": "Email confirmed successfully",
		"user":    user.GetPublicProfile(),
	})
}

func ResendConfirmationCode(c *fiber.Ctx) error {
	userEmail := c.FormValue("email")

	if userEmail == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Email is required"})
	}

	db := database.GetDB()

	user := models.User{
		Email: userEmail,
	}

	if err := db.Where("email = ?", userEmail).First(&user).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
	}

	emailConfirmationDto, err := user.GenerateConfirmEmailDto()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate registration token"})
	}

	emailService, err := email.NewEmailService()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to initialize email service"})
	}

	if err := emailService.SendConfirmationEmail(userEmail, emailConfirmationDto.RegistrationToken); err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to send confirmation email"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"message": "Confirmation email sent successfully"})

}

func DeleteuserById(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(400).JSON(fiber.Map{"error": "User ID is required"})
	}

	fmt.Println("Deleting user with ID:", id)

	db := database.GetDB()
	if err := db.Where("id = ?", id).Delete(&models.User{}).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to delete user"})
	}

	return c.Status(200).JSON(fiber.Map{"message": "User deleted successfully"})
}

// UserUpdate represents the fields that can be updated
type UserUpdate struct {
	Username string `json:"username,omitempty"`
	Email    string `json:"email,omitempty"`
	Theme    string `json:"theme,omitempty"`
}

func UpdateUser(c *fiber.Ctx) error {
	id := c.Params("id")
	if id == "" {
		return c.Status(400).JSON(fiber.Map{"error": "User ID is required"})
	}

	db := database.GetDB()
	var existingUser models.User
	if err := db.Where("id = ?", id).First(&existingUser).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}

	// Parse only the allowed update fields
	var updateData UserUpdate
	if err := c.BodyParser(&updateData); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	// Update only the fields that were provided
	if updateData.Username != "" {
		existingUser.Username = updateData.Username
	}
	if updateData.Email != "" {
		existingUser.Email = updateData.Email
	}
	if updateData.Theme != "" {
		existingUser.Theme = updateData.Theme
	}

	// Save the changes to the database
	if err := db.Save(&existingUser).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update user"})
	}

	return c.Status(200).JSON(fiber.Map{
		"message": "User updated successfully",
		"user":    existingUser.GetPublicProfile(),
	})
}

func UpdatePassword(c *fiber.Ctx) error {
	id := c.Params("id")
	password := c.FormValue("password")

	if id == "" {
		return c.Status(400).JSON(fiber.Map{"error": "User ID is required"})
	}

	if password == "" {
		return c.Status(400).JSON(fiber.Map{"error": "Password is required"})
	}

	db := database.GetDB()
	var existingUser models.User
	if err := db.Where("id = ?", id).First(&existingUser).Error; err != nil {
		return c.Status(404).JSON(fiber.Map{"error": "User not found"})
	}

	// Use the SetPassword method to hash the password
	if err := existingUser.SetPassword(password); err != nil {
		return c.Status(400).JSON(fiber.Map{"error": err.Error()})
	}

	if err := db.Save(&existingUser).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{"error": "Failed to update password"})
	}

	return c.Status(200).JSON(fiber.Map{
		"message": "Password updated successfully",
		"user":    existingUser.GetPublicProfile(),
	})
}

func Authenticate(c *fiber.Ctx) error {
	user := c.Locals("user").(models.User)

	if user.Email == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "User not authenticated"})
	}

	token, err := user.GenerateAuthToken()
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to generate token"})
	}

	return c.JSON(fiber.Map{"token": token, "user": user.GetPublicProfile()})
}
