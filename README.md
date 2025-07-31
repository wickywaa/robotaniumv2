# Project Name

> 🚧 **Work in Progress**  
This project is currently under active development. Expect frequent changes and improvements as features are added and the architecture evolves.

## 📌 What is This?

This app is designed to **register and manage Raspberry Pi-based bots** that can:

- Stream live video using **WebRTC**
- Connect remotely via a **peer-to-peer** connection
- **Control GPIO pins** (e.g., motors, sensors, actuators)

The core use case is for lightweight, remote-controlled bots — such as security cams, robotics projects, or IoT devices — all from a web interface.

Previously, a personal version of this system relied on a **paid Vonage video service**, which incurred ongoing costs. This open-source version replaces that with **custom WebRTC streaming powered by [Pion](https://github.com/pion/webrtc)**, enabling **free, direct peer-to-peer video** for one-on-one connections.

## 🔄 Why the Backend Migration?

The backend was rewritten from **NestJS (Node.js)** to **Go** in order to:

- Use **Pion** for building our own custom WebRTC stack
- Gain better performance and concurrency support with Go
- Reduce reliance on third-party services (e.g., Vonage)
- Lower operational costs while maintaining high-quality streaming

## 🔧 Current Work

- ✅ Migrated backend from **NestJS** to **Go**
- ⏳ Integrating the **client app** with **WebSocket** signaling
- 🔜 Adding **WebRTC** support to the **customer-facing app** (already working in the admin interface)

## 🧭 Roadmap

- [ ] Complete WebSocket signaling integration on the client side
- [ ] Implement WebRTC in the customer app using **Pion**
- [ ] Add GPIO control interface (e.g., start/stop motors, toggle sensors)
- [ ] Refactor code for better modularity and maintainability
- [ ] Add automated tests and CI/CD setup

## ▶️ Running the Project Locally

To see the project in action, clone the repo and run:

```bash
docker-compose build
```
```bash
docker-compose up
```

test user
```bash
 gav@robotanium.com
```

```bash
 adminRobotanium1!
```
