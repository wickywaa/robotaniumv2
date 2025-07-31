package models

// Cockpit represents a cockpit belonging to a bot.
type Cockpit struct {
	ID    int    `db:"id" json:"id"`
	Name  string `db:"name" json:"name"`
	BotID int    `db:"bot_id" json:"botId"`
}
