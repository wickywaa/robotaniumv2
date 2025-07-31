package controllers

import (
	"backendv2/models"
	"backendv2/pkg/database"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func GetBotsByUserId(c *fiber.Ctx) error {

	userInterface := c.Locals("user")
	fmt.Println("hl")

	if userInterface == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	authenticatedUser, ok := userInterface.(models.User)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	db := database.GetDB()

	var bots []models.Bot
	var publicbots []models.Publicbot
	query := db.Model(&models.Bot{})

	if !authenticatedUser.IsRobotaniumAdmin {
		query = query.Where("admin_id = ?", authenticatedUser.ID).Preload("Cockpits").Order("created_at desc").Find(&bots)
	}

	if authenticatedUser.IsRobotaniumAdmin {
		db.Preload("Cockpits").Order("created_at desc").Find(&bots)
	}

	if query.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": "Failed to get bots"})
	}

	for _, bot := range bots {
		pb := models.Publicbot{
			ID:        bot.ID,
			Name:      bot.Name,
			Cockpits:  bot.Cockpits,
			ImageURL:  bot.ImageURL,
			Image:     "",
			CreatedAt: bot.CreatedAt,
		}

		publicbots = append(publicbots, pb)
	}

	return c.Status(fiber.StatusOK).JSON(publicbots)

}
