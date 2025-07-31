package main

import (
	"backendv2/pkg/database"
	"backendv2/pkg/firebase"
	"backendv2/routes"
	ws "backendv2/ws"
	"fmt"
	"log"
	"os"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/logger"
	"github.com/gofiber/websocket/v2"
)

func main() {
	// Verify required environment variables
	if os.Getenv("JWT_SECRET_KEY") == "" {
		log.Fatal("JWT_SECRET_KEY environment variable is required")
	}

	_, err := database.InitDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	log.Println("Database connected successfully")
	app := fiber.New()
	firebase.InitFirebase()

	bucket, err := firebase.StorageClient.DefaultBucket()
	if err != nil {
		log.Fatalf("🚨 Firebase Storage not authenticated properly: %v", err)
	}
	log.Printf("✅ Firebase authenticated, using bucket: %+v\n", bucket)

	// Add Fiber's built-in logger
	app.Use(logger.New())
	app.Static("/", "./")

	// Add our custom debug logger
	app.Use(func(c *fiber.Ctx) error {
		log.Printf("DEBUG: Incoming request: %s %s\n", c.Method(), c.Path())
		fmt.Printf("DEBUG: Incoming request: %s %s\n", c.Method(), c.Path())
		fmt.Println("Starting server test 3")
		return c.Next()
	})

	app.Get("/backendv2/test", func(c *fiber.Ctx) error {
		log.Println("Test route hit!")
		return c.JSON(fiber.Map{
			"message": "API is working",
		})
	})

	hub := ws.NewHub()
	go hub.Run()

	routes.SetupRoutes(app, hub)

	// Optional middleware to upgrade only certain paths
	app.Use("/ws", func(c *fiber.Ctx) error {
		if websocket.IsWebSocketUpgrade(c) {
			return c.Next()
		}
		return fiber.ErrUpgradeRequired
	})

	app.Get("/ws", websocket.New(func(c *websocket.Conn) {
		defer c.Close()
		for {
			msgType, msg, err := c.ReadMessage()
			if err != nil {
				break
			}
			// Echo back the message
			c.WriteMessage(msgType, msg)
		}
	}))

	log.Println("Server starting on port 8080...")
	app.Listen("0.0.0.0:8080")
}
