package controllers

import (
	"backendv2/models"
	"backendv2/pkg/database"
	"encoding/json"
	"context"
	"backendv2/pkg/firebase"
	"fmt"
	"io"
	"net/url"
	"time"
 "strconv"

	"github.com/gofiber/fiber/v2"
)

func UpdateBot(c *fiber.Ctx) error {

	fmt.Println("UpdateBot called")
	botIDStr := c.Params("id")
	userInterface := c.Locals("user")

	if userInterface == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}

	authenticatedUser, ok := userInterface.(models.User)

	if !ok {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"error": "unauthorized"})
	}

	var req models.BotRequest

	fileHeader, noFile := c.FormFile("image")
	payload := c.FormValue("payload")
	db := database.GetDB()

	bot := new(models.Bot)

	if err := c.BodyParser(bot); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "invalid request"})
	}

	if err := json.Unmarshal([]byte(payload), &req); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "invalid JSON payload",
		})
	}

	if !authenticatedUser.IsRobotaniumAdmin {
		db.Where("admin_id = ? AND id = ? ", authenticatedUser.ID, botIDStr).Preload("Cockpits").Order("created_at desc").Find(&bot)
	}

	if authenticatedUser.IsRobotaniumAdmin {
		db.Where("id = ?").Preload("Cockpits").Order("created_at desc").Find(&bot)
	}

	var objectName string
	if noFile == nil {
		
		fmt.Println("made here pic")
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
			return c.Status(fiber.StatusInternalServerError).SendString("Failed to finalize upload")
		}
	}

	updated := false

	if req.BotName != "" && req.BotName != bot.Name {
		bot.Name = req.BotName
		updated = true
	}


	if req.Password != "" && len(req.Password) > 0 {
		bot.SetPassword(req.Password)
	updated = true
}


			 if updated {
	if err := db.Save(bot).Error; err != nil {
		fmt.Println("made here save bot")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": fmt.Sprintf("Failed to create bot: %v", err)})
	}
}

	botID, err := strconv.Atoi(botIDStr) // returns int
	if err != nil {
	return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
		"error": "Invalid botId",
	})

	for i := range req.Cockpit {
	req.Cockpit[i].BotID = botID
}
}

	var toInsert []models.Cockpit
	var toUpdate []models.Cockpit
	
	
	for i, cp := range req.Cockpit {
		 

		 fmt.Sprintf("Cockpit at index %d is missing a name", cp.BotID)
		if cp.Name == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": fmt.Sprintf("Cockpit at index %d is missing a name", i),
		})
	}

	if cp.BotID != 0 && cp.BotID < 0 {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": fmt.Sprintf("Cockpit at index %d has an invalid ID", i),
		})
	} 

	db := database.GetDB()

	cockpit := new(models.Cockpit)
	err := db.Where("id = ?", cp.ID).First(&cockpit).Error

		cp.BotID = botID

	if err != nil { 
		cp.ID = 0
		toInsert = append(toInsert,cp)
	} else {
	 toUpdate = append(toUpdate, cp)
	}
	}

	for i, cp := range toUpdate {
	fmt.Printf("Cockpit to update %d: ID=%d, Name=%s, BotID=%d\n", i, cp.ID, cp.Name, cp.BotID)
}

for i, cp := range toInsert {
	fmt.Printf("Cockpit to insert %d: ID=%d, Name=%s, BotID=%d\n", i, cp.ID, cp.Name, cp.BotID)
}



	for _, cp := range toUpdate {
	if err := db.Model(&models.Cockpit{}).Where("id = ?", cp.ID).Updates(cp).Error; err != nil {
		return err // or collect the error and continue
	}
}

if len(toInsert) > 0 {
	if err := db.Create(&toInsert).Error; err != nil {
		return c.Status(500).JSON(fiber.Map{
			"error": "Failed to insert cockpits: " + err.Error(),
		})
	}
}

	return c.Status(200).JSON(fiber.Map{"message": "nothing to update"})

}
