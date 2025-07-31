package models

import "encoding/json"

type IncomingMessage struct {
	Event string          `json:"event"`
	Data  json.RawMessage `json:"data"`
}
