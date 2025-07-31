package firebase

import (
	"context"
	"log"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/storage"
	"google.golang.org/api/option"
)

var App *firebase.App
var StorageClient *storage.Client

func InitFirebase() {

	ctx := context.Background()

	opt := option.WithCredentialsFile("serviceAccountKey.json")

	app, err := firebase.NewApp(ctx, &firebase.Config{
		StorageBucket: "robotanium-admin.appspot.com",
	}, opt)
	if err != nil {
		log.Fatalf("error initializing app: %v\n", err)
	}

	client, err := app.Storage(ctx)
	if err != nil {
		log.Fatalf("error initializing storage client: %v\n", err)
	}

	App = app
	StorageClient = client
}
