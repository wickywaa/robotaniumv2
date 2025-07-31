package ws

import (
	"log"

	"github.com/gofiber/websocket/v2"
	"github.com/gofiber/fiber/v2" 
)

func ServeWS(hub *Hub) fiber.Handler {
	return websocket.New(func(conn *websocket.Conn) {
		userID := conn.Query("userID") // or get from Locals if passed before

		client := &Client{
			ID:   userID,
			Hub:  hub,
			Conn: conn,
			Send: make(chan []byte, 256),
		}

		hub.Register <- client

		go client.WritePump()
		go client.ReadPump()
	})
}

func HandleWebSocket(c *websocket.Conn) {
	defer c.Close()
	log.Println("WebSocket client connected")

	for {
		msgType, msg, err := c.ReadMessage()
		if err != nil {
			log.Println("read error:", err)
			break
		}

		log.Printf("Received: %s", msg)

		// Echo the message back
		if err := c.WriteMessage(msgType, msg); err != nil {
			log.Println("write error:", err)
			break
		}
	}
}
