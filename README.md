# 🚀 E-Transit App

**E-Transit** is a web application that shows the **real-time location of buses** in rural areas, built to improve local public transport monitoring.

---

## 🎥 Project Demo

- 📽️ [Watch on Google Drive](https://drive.google.com/file/d/19uDU3cl4qMC4hKfbm5RJqk0_YSdruKcg/view)  
- 📥 [Direct Download (if preview fails)](https://drive.google.com/uc?export=download&id=19uDU3cl4qMC4hKfbm5RJqk0_YSdruKcg)

---

## 🔧 Components Overview

This app runs using three main components:

### 1. GPS Device Tracking System (MERN Stack)
Handles GPS data collection and pushing location to the server.
- 📽️ [Watch on Google Drive](https://drive.google.com/file/d/1PJE0kWcdfaX76IUAZN2ylQlYQPOEo_iJ/view?usp=drive_link)
- 📦 [Frontend Repo](https://github.com/codesbyharsh/GPS_device.git)  
- ⚙️ [Backend Repo](https://github.com/codesbyharsh/LSbackend.git)  

### 2. Dynamic Trip/Route Assigner (Python Backend)
Automatically assigns routes/trips based on GPS or schedule data.

- 🐍 [Python Assigner Repo](#)

### 3. Frontend (Vite + React)
Displays the live bus tracking, maps, trips, and routes.

- 🌐 [Watch Preview](https://etransit.vercel.app/)  
- 💻 This Repository

---

## 📦 Prerequisites

- Static GTFS file: [gtfs.zip](https://msrtctransit.multiscreensite.com/gtfs/gtfs.zip)  
  📘 [GTFS builder guidebook](https://drive.google.com/file/d/1Ddn3vS-hy_EqjV63ZAbLv3hU_ptmHaH5/view?usp=sharing)  
  🛠️ [Download GTFS Builder](https://www.nationalrtap.org/Technology-Tools/GTFS-Builder/Support)
  
- Node.js and npm installed  
- `.env` file setup with required credentials

---

## ⚙️ Tech Stack

- 🧠 React  
- ⚡ Vite  
- 📦 npm  
- 🌐 JavaScript (ES6+)  
- 🧭 Leaflet for Maps  
- 📁 dotenv for environment configuration

---
### 🛠️ Setup Instructions (Local Setup for Frontend)


## 1. Clone the Repository
```bash
git clone https://github.com/codesbyharsh/etransit.git
cd etransit
```

### 2. Install Dependencies
```bash
-npm install
-# or
-npm i
```

### 3. Configure Environment Variables
```bash
Create a .env file in the root directory of the project.

Add the required environment variables inside it.

Sample .env file is provided in the code.
```

### 4. Run the App
```bash
npm run dev
```
application will run on:http://localhost:5173/


---
Permission letter from Depo:
 ![image](https://github.com/user-attachments/assets/cf10dca3-e4ce-41be-8808-9c1fd49b436f)

---
- [Project Indexing](https://drive.google.com/file/d/1ty5MD8WWv5B24UTFKiWzkF5-8bh4q0OM/view?usp=sharing)
- [Project Report](https://drive.google.com/file/d/1WVt7iWaJFpKGrzV-zzfZvOImVxLtwy_i/view?usp=sharing)


