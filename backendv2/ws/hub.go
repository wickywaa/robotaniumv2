package ws

type Hub struct {
	Clients       map[string]*Client
	Bots          map[string]*BotClient
	Register      chan *Client
	Unregister    chan *Client
	RegisterBot   chan *BotClient
	UnRegisterBot chan *BotClient
	Broadcast     chan []byte
}

func NewHub() *Hub {
	return &Hub{
		Clients:       make(map[string]*Client),
		Bots:          make(map[string]*BotClient),
		Register:      make(chan *Client),
		Unregister:    make(chan *Client),
		RegisterBot:   make(chan *BotClient),
		UnRegisterBot: make(chan *BotClient),
		Broadcast:     make(chan []byte),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.Register:
			h.Clients[client.ID] = client

		case client := <-h.Unregister:
			if _, ok := h.Clients[client.ID]; ok {
				delete(h.Clients, client.ID)
				close(client.Send)
			}

		case bot := <-h.RegisterBot:

			println("bot is registering, bo")
			h.Bots[bot.ID] = bot
			confirmation := []byte(`{"type":"system","message":"connection confirmed"}`)
			bot.Send <- confirmation

		case bot := <-h.UnRegisterBot:
			if _, ok := h.Bots[bot.ID]; ok {
				delete(h.Bots, bot.ID)
				close(bot.Send)
			}

		case message := <-h.Broadcast:
			for _, client := range h.Clients {
				client.Send <- message
			}

			for _, bot := range h.Bots {
				bot.Send <- message
			}
		}
	}
}

func (h *Hub) SendToClient(clientID string, message []byte) {
	if client, ok := h.Clients[clientID]; ok {
		client.Send <- message
	}
}

func (h *Hub) SendToBot(botID string, message []byte) {
	if bot, ok := h.Bots[botID]; ok {
		bot.Send <- message
	}
}

func (h *Hub) BroadcastToBots(message []byte) {
	for _, bot := range h.Bots {
		bot.Send <- message
	}
}

func (h *Hub) BroadcastToClients(message []byte) {
	for _, client := range h.Clients {
		client.Send <- message
	}
}
