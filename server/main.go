package main

import (
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

// Define a structure for the device info
type DeviceInfo struct {
	Name string `json:"name"`
	ID   string `json:"id"`
}

// Global map to hold all devices
var devices = make(map[string]DeviceInfo)
var mu sync.Mutex

// WebSocket connection
var upgrader = websocket.Upgrader{}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("Error while upgrading connection:", err)
		return
	}
	defer conn.Close()

	for {
		// Read messages from the client
		var deviceInfo DeviceInfo
		err := conn.ReadJSON(&deviceInfo)
		if err != nil {
			log.Println("Error reading JSON:", err)
			break
		}

		mu.Lock()
		devices[deviceInfo.ID] = deviceInfo // Store device info
		mu.Unlock()

		// Broadcast to all connected clients
		for _, dev := range devices {
			err := conn.WriteJSON(dev) // Notify other clients
			if err != nil {
				log.Println("Error while writing to WebSocket:", err)
			}
		}
	}
}

// Main function
func main() {
	http.Handle("/", http.FileServer(http.Dir("./client")))

	http.HandleFunc("/ws", wsHandler)

	log.Println("Starting server on http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
