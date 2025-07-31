package ws

import "github.com/gofiber/websocket/v2"

type Client struct {
	ID   string
	Hub  *Hub
	Conn *websocket.Conn
	Send chan []byte
}

func (c *Client) ReadPump() {
    defer func() {
        c.Hub.Unregister <- c
        c.Conn.Close()
    }()

    for {
        _, message, err := c.Conn.ReadMessage()
        if err != nil {
            break
        }
        c.Hub.Broadcast <- message
    }
}

func (c *Client) WritePump() {
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
