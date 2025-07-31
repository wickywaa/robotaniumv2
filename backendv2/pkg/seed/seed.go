// pkg/seed/seed.go
package seed

import (
	"backendv2/models"
	"log"

	"gorm.io/gorm"
)

// SeedAdminUser creates an initial admin user if none exists
func SeedAdminUser(db *gorm.DB) error {
	var count int64
	if err := db.Model(&models.User{}).Count(&count).Error; err != nil {
		return err
	}

	// Only seed if there are no users
	if count == 0 {
		log.Println("Seeding initial admin user...")

		// Create admin user
		user := models.User{
			Email:             "gav@robotanium.com",
			Username:          "robotanium",
			IsRobotaniumAdmin: true,
			IsPlayerAdmin:     false,
			IsActive:          true,
			IsEmailVerified:   true,
			Theme:             "dark",
		}

		// Set password using the model's method
		if err := user.SetPassword("adminRobotanium1!"); err != nil {
			return err
		}

		// Save to database
		if err := db.Create(&user).Error; err != nil {
			return err
		}

		log.Println("Admin user created successfully")
	} else {
		log.Println("Database already has users, skipping admin user creation")
	}

	return nil
}
