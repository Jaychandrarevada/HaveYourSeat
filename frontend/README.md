# HaveYourSeat 🎬 🎫

**HaveYourSeat** is a premium, modern, full-stack web application designed for seamlessly discovering movies and reserving theater tickets. It utilizes a stunning "Deep Glass" frosted UI aesthetic and integrates a robust MERN (MongoDB, Express, React, Node.js) architecture.

## 🚀 Live Demo
- **Frontend** (Vercel): *(Deployment in progress)*
- **Backend API** (Render): *(Deployment successful)*

## ✨ Features
- **Cinematic Discovery:** Beautiful, animated movie cards pulling official high-definition movie artworks natively into your browser.
- **Seat Mapping Engine:** An interactive theater grid that visually tracks and mathematically reserves ticket choices in real-time.
- **Authentication:** Secure user registration, encrypted login flows, and active session management utilizing `bcrypt` and JWT algorithms.
- **Ticket Generation:** Programmatically renders and exports your completed movie ticket into a crisp, high-fidelity PNG image (`html-to-image`) straight to your local device.
- **Unrestricted Poster Engine:** Integrated dashboard letting anyone effortlessly paste custom URLs to overhaul the movie imagery instantaneously.

## 🛠️ Tech Stack
### Frontend (The Visual Experience)
*   **React 19** utilizing Vite for ultra-fast Hot Module Replacement (HMR).
*   **Tailwind CSS v4** powering custom blur drops, complex lighting gradients, and the deep cohesive styling language.
*   **Lucide-React** for sharp, scalable SVG iconography.
*   **Axios** for fluid, stateless HTTP transmission.

### Backend (The Core Engine)
*   **Node.js & Express** providing lightning-fast non-blocking API endpoints.
*   **MongoDB & Mongoose** orchestrating complex relational schemas spanning Users, Movies, and Booking ledgers securely.
*   **Dotenv** isolating critical passwords and environments.

## 💻 Getting Started Locally

### 1. Database Setup
Ensure you have a local MongoDB instance running, or connect directly to MongoDB Atlas.

### 2. Run the Backend Server
```bash
cd backend
npm install
# Set your MONGODB_URI and JWT_SECRET in a .env file!
npm start
```

### 3. Run the Frontend Client
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

## 🌍 Cloud Deployment Structure
This repository perfectly aligns with cloud-native hosting standards:
1. **Database:** MongoDB Atlas serverless clusters.
2. **Backend Architecture:** Render.com hosting the Express.js APIs.
3. **Frontend Edge:** Vercel CDN hosting the statically built Vite pipeline.

---
*Built with passion, robust modern technologies, and an unwavering focus on immersive design aesthetics.*
