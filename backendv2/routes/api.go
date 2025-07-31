package routes

import (
	"backendv2/controllers"
	"backendv2/middleware"
	ws "backendv2/ws"

	"github.com/gofiber/fiber/v2"
)

func SetupRoutes(app *fiber.App, hub *ws.Hub) {
	// API v2 group
	api := app.Group("/api/v2")

	// Setup user routes
	setupUserRoutes(api, hub)
	SetupBotRoutes(api, hub)
}

func setupUserRoutes(api fiber.Router, hub *ws.Hub) {
	users := api.Group("/users")

	// Public routes (no authentication required)
	users.Post("/login", controllers.LoginUser)
	users.Post("/user", controllers.CreateUser)

	// Routes with authentication middleware applied individually
	users.Get("/user/:id", middleware.AuthMiddleware(), controllers.GetUser)
	users.Get("", middleware.AuthMiddleware(), controllers.GetUsers)
	users.Delete("/user/:id", middleware.AuthMiddleware(), controllers.DeleteuserById)
	users.Put("/user/:id", middleware.AuthMiddleware(), controllers.UpdateUser)
	users.Put("/changepassword", middleware.AuthMiddleware(), controllers.UpdatePassword)
	users.Post("/confirm", controllers.ConfirmEmail)
	users.Post("/authenticate", middleware.AuthMiddleware(), controllers.Authenticate)
}
