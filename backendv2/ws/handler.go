package ws

import (
	"fmt"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/websocket/v2"
)

func ServeWS(hub *Hub) fiber.Handler {
	println("anything")
	return websocket.New(func(conn *websocket.Conn) {
		if conn == nil {
			fmt.Println("ERROR: WebSocket upgrade failed, got nil conn")
			return
		}

		println("made it here 2")
		botID := conn.Query("botID")
		if botID == "" {
			println("Bot connection missing botID, closing")
			conn.Close()
			return
		}

		bot := &BotClient{
			ID:   botID,
			Hub:  hub,
			Conn: conn,
			Send: make(chan []byte, 256),
		}

		hub.RegisterBot <- bot

		go bot.WritePump()
		bot.Send <- []byte(`{"type":"system","message":"connected"}`)
		bot.ReadPump()
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
