package middleware

import (
	"backendv2/models"
	"backendv2/pkg/database"
	"errors"
	"fmt"
	"os"
	"strings"

	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

// AuthMiddleware verifies the JWT token and adds the user to context
func AuthMiddleware() fiber.Handler {
	return func(c *fiber.Ctx) error {
		// Get the Authorization header
		fmt.Println("hello")
		authHeader := c.Get("Authorization")
		if authHeader == "" {
			return c.Status(401).JSON(fiber.Map{"error": "Authorization header is required"})
		}

		// Check if it's a Bearer token
		tokenString := strings.Replace(authHeader, "Bearer ", "", 1)
		if len(tokenString) == 0 {
			return c.Status(401).JSON(fiber.Map{"error": "Invalid authorization header format"})
		}


		// Parse and validate the token
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			// Get the secret key from environment
			secretKey := os.Getenv("JWT_SECRET_KEY")
			if secretKey == "" {
				return nil, errors.New("JWT_SECRET_KEY environment variable is not set")
			}
			return []byte(secretKey), nil
		})

		if err != nil || !token.Valid {
			return c.Status(401).JSON(fiber.Map{"error": "Invalid token"})
		}

		// Get the user ID from the token claims
		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			return c.Status(401).JSON(fiber.Map{"error": "Invalid token claims"})
		}

		fmt.Println("claims:", claims)

		userID := uint(claims["user_id"].(float64))

		fmt.Println("User ID:", userID)

		// Get the user from the database
		db := database.GetDB()
		var user models.User
		if err := db.First(&user, userID).Error; err != nil {
			return c.Status(401).JSON(fiber.Map{"error": "User not found"})
		}

		// Add the user to the context
		c.Locals("user", user)

		return c.Next()
	}
}
