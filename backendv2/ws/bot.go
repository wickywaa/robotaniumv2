package ws

import (
	models "backendv2/models"
	"encoding/json"
	"log"

	"github.com/gofiber/websocket/v2"
)

type BotClient struct {
	ID   string
	Hub  *Hub
	Conn *websocket.Conn
	Send chan []byte
}

func (c *BotClient) ReadPump() {
	defer func() {
		c.Hub.UnRegisterBot <- c
		c.Conn.Close()
	}()

	for {
		_, message, err := c.Conn.ReadMessage()
		if err != nil {
			break
		}
		c.Hub.Broadcast <- message

		var incoming models.IncomingMessage

		if err := json.Unmarshal(message, &incoming); err != nil {
			log.Println("invalid message formate")
		}

		switch incoming.Event {
		case "connect":
			c.Hub.SendToBot(c.ID, []byte("thanks for connecting"))
		}

	}
}

func (c *BotClient) WritePump() {
	defer c.Conn.Close()

	for {
		msg, ok := <-c.Send
		if !ok {
			c.Conn.WriteMessage(websocket.CloseMessage, []byte{})
			return
		}
		c.Conn.WriteMessage(websocket.TextMessage, msg)
	}
}
