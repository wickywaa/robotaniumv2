package controllers

import (
	"backendv2/models"
	"backendv2/pkg/database"
	"backendv2/pkg/firebase"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/url"
	"time"

	"github.com/gofiber/fiber/v2"
)

func CreateBot(c *fiber.Ctx) error {

	var errors []string
	var req models.BotRequest
	fileHeader, noFile := c.FormFile("image")

	payload := c.FormValue("payload")
	db := database.GetDB()
	fmt.Println("Raw JSON payload string:", payload)

	bot := new(models.Bot)

	if err := c.BodyParser(bot); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Invalid request"})
	}

	if err := json.Unmarshal([]byte(payload), &req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid JSON payload",
		})
	}

	if len(req.BotName) < 3 {
		errors = append(errors, "botName must be at least 3 characters")
	}
	if len(req.Password) < 6 {
		errors = append(errors, "password must be at least 6 characters")
	}

	if len(errors) > 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"errors": errors,
		})
	}

	userInterface := c.Locals("user")

	if userInterface == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	authenticatedUser, ok := userInterface.(models.User)
	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "Unauthorized"})
	}

	bot.AdminID = int(authenticatedUser.ID)
	bot.Name = req.BotName

	bot.SetPassword(req.Password)
	var objectName string

	if noFile == nil {

		file, err := fileHeader.Open()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Cannot open file")
		}

		defer file.Close()
		ctx := context.Background()
		bucket, err := firebase.StorageClient.DefaultBucket()
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Cannot access bucket")
		}

		objectName = fmt.Sprintf("uploads/%d-%s", time.Now().Unix(), fileHeader.Filename)
		urlEncodedName := url.PathEscape(objectName)
		publicURL := fmt.Sprintf("https://firebasestorage.googleapis.com/v0/b/%s/%s?alt=media", "robotanium-admin.appspot.com/o", urlEncodedName)

		bot.ImageURL = publicURL

		writer := bucket.Object(objectName).NewWriter(ctx)
		writer.ContentType = fileHeader.Header.Get("Content-Type")

		if _, err := io.Copy(writer, file); err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Failed to upload file")
		}
		if err := writer.Close(); err != nil {
			return c.Status(fiber.StatusInternalServerError).SendString("Failed to finalize upload" + err.Error())
		}

	}

	if err := db.Create(bot).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": fmt.Sprintf("Failed to create bot: %v", err)})
	}
	cockpits := make([]models.Cockpit, len(req.Cockpit))
	for i, cp := range req.Cockpit {
		cockpits[i] = models.Cockpit{Name: cp.Name, BotID: bot.ID}
	}

	if err := db.Create(&cockpits).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": err.Error(),
		})
	}
	var publicBot models.Publicbot

	publicBot.ID = bot.ID
	publicBot.Name = bot.Name
	publicBot.Cockpits = cockpits

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message":  "bot created",
		"filePath": objectName,
		"bot":      publicBot,
	})

}
