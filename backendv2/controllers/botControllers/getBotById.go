package controllers

import (
	"backendv2/models"
	"backendv2/pkg/database"

	"github.com/gofiber/fiber/v2"
)

func GetBotById(c *fiber.Ctx) error {

	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Bot ID is required"})
	}

	userInterface := c.Locals("user")

	if userInterface == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	authenticatedUser, ok := userInterface.(models.User)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}
	db := database.GetDB()

	bot := new(models.Bot)
	if err := db.Where("id = ?", id).First(bot).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Bot not found"})
	}

	if authenticatedUser.ID != uint(bot.AdminID) {
		return c.Status(fiber.StatusForbidden).JSON(fiber.Map{"error": "Forbidden"})
	}

	return c.Status(fiber.StatusOK).JSON(bot)

}
