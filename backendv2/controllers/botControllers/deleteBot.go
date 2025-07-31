package controllers

import (
	"backendv2/models"
	"backendv2/pkg/database"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func DeleteBot(c *fiber.Ctx) error {
	fmt.Println("DeleteBot called")

	id := c.Params("id")
	if id == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "id is required"})
	}

	userInterface := c.Locals("user")

	if userInterface == nil {
		return c.Status(fiber.StatusUnauthorized).JSON((fiber.Map{"error": " unauthorized"}))
	}

	authenticatedUser, ok := userInterface.(models.User)

	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}
	db := database.GetDB()
	var bots []models.Bot
	query := db.Model(&models.Bot{})

	if !authenticatedUser.IsRobotaniumAdmin {
		query.Where("id = ? AND admin_id = ?", id, authenticatedUser.ID).First(&bots)
	}

	if authenticatedUser.IsRobotaniumAdmin {
		query.Where("id = ?", id, authenticatedUser.ID)
	}

	if query.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not find bot dto delete"})
	}

	if err := query.Delete(&models.Bot{}).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Could not delte user"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"error": "Bot found and deleted"})

}
