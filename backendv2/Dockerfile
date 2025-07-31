# Development stage
FROM golang:1.23 AS dev

# Set important environment variables
ENV GOPATH /go
ENV GO111MODULE on
ENV CGO_ENABLED 0

# Install development tools
RUN go install github.com/githubnemo/CompileDaemon@latest

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# The rest of the files will be mounted as a volume in docker-compose
COPY . .

# Expose both API and debug ports
EXPOSE 8080 40000

# Use CompileDaemon for hot reloading
CMD ["CompileDaemon","--polling", "--build=go build -o main .", "--command=./main"]

# Production build stage
FROM golang:1.20-alpine AS builder

WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download

COPY . .

# Build the application
RUN CGO_ENABLED=0 GOOS=linux go build -o main .

# Production stage
FROM alpine:latest AS prod

RUN apk --no-cache add ca-certificates

WORKDIR /root/

# Copy the binary from builder
COPY --from=builder /app/main .
COPY --from=builder /app/migrations ./migrations

EXPOSE 8080


CMD ["./main"]

# Final stage selection
FROM ${BUILD_ENV:-dev} AS final 