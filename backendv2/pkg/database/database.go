// pkg/database/database.go
package database

import (
	"backendv2/pkg/seed"
	"fmt"
	"log"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var db *gorm.DB

func GetDB() *gorm.DB {
	return db
}

func GetDatabaseURL() string {
	host := os.Getenv("DB_HOST")
	user := os.Getenv("DB_USER")
	password := os.Getenv("DB_PASSWORD")
	dbname := os.Getenv("DB_NAME")
	port := os.Getenv("DB_PORT")

	// Fallback to default values if env vars are not set
	if host == "" {
		host = "postgres"
	}
	if user == "" {
		user = "postgres"
	}
	if password == "" {
		password = "robotanium_dev"
	}
	if dbname == "" {
		dbname = "robotanium_db"
	}
	if port == "" {
		port = "5432"
	}

	return fmt.Sprintf("postgres://%s:%s@%s:%s/%s?sslmode=disable",
		user, password, host, port, dbname)
}

func InitDB() (*gorm.DB, error) {
	dbURL := GetDatabaseURL()
	log.Printf("Connecting to database: %s", dbURL)

	var err error
	db, err = gorm.Open(postgres.Open(dbURL), &gorm.Config{})
	if err != nil {
		return nil, fmt.Errorf("failed to connect to database: %w", err)
	}
	// Run migrations
	if err := RunMigrations(dbURL); err != nil {
		log.Printf("Warning: Failed to run migrations: %v", err)
	}

	if err := seed.SeedAdminUser(db); err != nil {
		log.Printf("Warning: Failed to seed admin user: %v", err)
	}

	return db, nil
}
