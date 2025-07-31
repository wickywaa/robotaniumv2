package routes

import (
	controllers "backendv2/controllers/botControllers"
	"backendv2/middleware"
	"backendv2/ws"

	"github.com/gofiber/fiber/v2"
)



func SetupBotRoutes(api fiber.Router, hub *ws.Hub ) {
	bots := api.Group("/bots")
	// Get all bots (for robotanium admins) or user's bots (for regular users)
	bots.Get("", middleware.AuthMiddleware(), controllers.GetBotsByUserId)

	// Get specific bot (only if user owns it or is robotanium admin)
	bots.Get("/:id", middleware.AuthMiddleware(), controllers.GetBotById)

	// Create new bot (any authenticated user can create)
	bots.Post("", middleware.AuthMiddleware(), controllers.CreateBot)

	// Update bot (only if user owns it or is robotanium admin)
	bots.Put("/:id", middleware.AuthMiddleware(), controllers.UpdateBot)

	// Delete bot (only if user owns it or is robotanium admin)
	bots.Delete("/:id", middleware.AuthMiddleware(), controllers.DeleteBot)

	bots.Get("/ws/bot", ws.ServeWS(hub))
}
