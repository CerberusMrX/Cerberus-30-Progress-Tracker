<div align="center">
  <img src="https://via.placeholder.com/150/000000/FFFFFF/?text=C30" alt="Cerberus 30 Logo" width="120" height="120" style="border-radius: 20px;">
  
  <h1 align="center">Cerberus 30</h1>
  
  <p align="center">
    <strong>The Ultimate 30-Day Hardcore Progression Matrix & Tracker</strong>
  </p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#installation">Installation</a> •
    <a href="#usage">Usage</a>
  </p>
  
  <div align="center">
    <img src="https://img.shields.io/badge/React-19.2-blue.svg?style=for-the-badge&logo=react" alt="React" />
    <img src="https://img.shields.io/badge/TailwindCSS-4.2-38B2AC.svg?style=for-the-badge&logo=tailwind-css" alt="Tailwind" />
    <img src="https://img.shields.io/badge/Express.js-5.2-000000.svg?style=for-the-badge&logo=express" alt="Express" />
    <img src="https://img.shields.io/badge/Vite-8.0-646CFF.svg?style=for-the-badge&logo=vite" alt="Vite" />
  </div>
</div>

---

## ⚡ Overview

**Cerberus 30** is a gamified, intense 30-day challenge tracker designed for individuals seeking absolute discipline. With features like "Fail = Reset Mode," an intelligent **Oracle AI** assistant, and a highly visual heatmap progression matrix, Cerberus 30 holds you accountable like no other tool.

Whether you are tracking fitness, coding streaks, or personal development milestones, the **30-Day Matrix** gives you a bird's-eye view of your momentum.

## 📸 UI Previews

<div align="center">
  <img src="assets/dashboard.png" alt="Cerberus 30 Dashboard View" width="800" style="border-radius: 10px; margin-bottom: 15px;" />
  <p><i>The Main Dashboard & Progression Timeline</i></p>
  
  <img src="assets/a.png" alt="30-Day Matrix Heatmap" width="800" style="border-radius: 10px; margin-bottom: 15px;" />
  <p><i>The 30-Day Matrix Heatmap</i></p>

  <img src="assets/setup.png" alt="Oracle AI Interface" width="800" style="border-radius: 10px; margin-bottom: 15px;" />
  <p><i>Integrated Oracle AI Assistant</i></p>
</div>

## ✨ Core Features

- 🧊 **30-Day Matrix (Heatmap):** A visual grid representing your daily consistency, making breaks in the chain instantly visible.
- 🔥 **Streak Mechanics:** Track your *Current Streak* and *Longest Streak* alongside your overall completion percentage.
- ☠️ **Fail = Reset Mode:** Optional hardcore mode that wipes your progress back to Day 1 upon a single missed day.
- 🤖 **Oracle AI Integration:** Integrated AI assistant directly in your dashboard to help guide, motivate, and optimize your challenge.
- 📊 **Progression Timeline:** Beautiful, animated progress bars charting your journey through the 30 days.
- ⚡ **Lightning Fast UI:** Built with Framer Motion for buttery-smooth animations and glassmorphism UI elements.

## 🛠 Tech Stack

### Frontend
- **React (v19)** with Vite
- **Tailwind CSS (v4)** for styling and utility-first design
- **Framer Motion** for complex layout animations and gestures
- **React Router (v7)** for seamless navigation
- **React Icons** for UI iconography

### Backend
- **Express.js (v5)** for API routes
- **Local JSON Storage** via Node.js File System (`fs`) for lightweight, instant data persistence without database overhead
- **Cors & Dotenv** for security and environment configuration
- **Multer** for handling local media and file uploads

## 🚀 Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/cerberusmrx/cerberus-30.git
   cd cerberus-30
   ```

2. **Setup the Backend (Server):**
   ```bash
   cd server
   npm install
   # Create your .env file
   cp .env.example .env
   # Start the Express server
   npm start
   ```

3. **Setup the Frontend (Client):**
   ```bash
   cd ../client
   npm install
   # Start the Vite development server
   npm run dev
   ```

4. **Open the Application:**
   Navigate to `http://localhost:5173` in your browser.

## 🎯 Usage

1. **Launch a Mission:** Start a new challenge on the `/setup` page, setting your goal and duration (e.g., 30 days).
2. **Hardcore Mode:** Toggle `Fail = Reset Mode` if you want maximum stakes.
3. **Log Daily:** Mark your days as complete or failed. Watch the **30-Day Matrix** populate and your **Progression Timeline** advance.
4. **Consult the Oracle:** Use the **Oracle AI** panel on your dashboard to ask for advice or modify your routine dynamically.

---

<div align="center">
  <i>Stay disciplined. Break the matrix.</i><br/>
  <b>Cerberus 30</b>
</div>
