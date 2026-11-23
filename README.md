# 🧭 FLOWWISE

### Navigate Smarter. Travel Freer.

> Your journey is more than reaching a destination — it's about getting there without the crowd.

FLOWWISE is a **crowdedness-aware journey planner** that recommends routes based not only on distance and travel time, but also on **real-time crowd density**. It helps users avoid overcrowded locations, identify less crowded routes, predict crowd density at their expected arrival time, and make smarter transportation decisions.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Smart Journey Planner** | Plan routes with 3 alternatives: Fastest, Least Crowded, Balanced |
| **Crowd Intelligence Engine** | Weighted scoring algorithm using community reports, time-of-day, day-of-week |
| **Route Optimization** | Configurable scoring formula with normalised travel time, crowd exposure, distance, reliability |
| **Interactive Crowd Map** | Leaflet + OpenStreetMap with crowd-density markers, route polylines, popups |
| **Crowd Prediction** | Time-based weighted prediction model for future crowd levels |
| **Community Reporting** | Users can report crowd conditions at any monitored location |
| **Analytics Dashboard** | Recharts-powered visualisations of crowd trends, peak hours, distributions |
| **Real-time Updates** | Socket.IO broadcasts crowd changes to all connected clients |
| **JWT Authentication** | Secure registration, login, and protected routes |

---

## 🛠 Technology Stack

### Frontend
- React 18 + Vite
- Tailwind CSS
- Lucide React Icons
- React Router v6
- Leaflet + React-Leaflet (OpenStreetMap)
- Recharts
- Socket.IO Client
- Axios

### Backend
- Node.js + Express.js
- Mongoose (MongoDB ODM)
- JWT Authentication + bcrypt
- Socket.IO
- REST API

### Database
- MongoDB (optional — runs in demo mode without it)

---

## 📁 Project Structure

```
FLOWWISE/
├── frontend/           # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── contexts/       # React context providers
│   │   ├── hooks/          # Custom React hooks
│   │   ├── pages/          # Page components
│   │   │   └── dashboard/  # Dashboard pages
│   │   ├── utils/          # API client, demo data
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
├── backend/            # Node.js + Express backend
│   ├── src/
│   │   ├── config/         # Database config
│   │   ├── middleware/     # Auth, error handling
│   │   ├── models/         # Mongoose models
│   │   ├── routes/         # Express route handlers
│   │   └── services/       # Business logic (crowd engine, route optimizer, predictions)
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18+ — [Download](https://nodejs.org/)
- **MongoDB** (optional) — The app runs in **Demo Mode** without it
- **pnpm** (recommended) or npm

### 1. Clone the repository

```bash
git clone <repo-url>
cd FLOWWISE
```

### 2. Backend Setup

```bash
cd backend
cp .env.example .env    # Configure environment variables
pnpm install            # Install dependencies
pnpm run seed           # (Optional) Seed MongoDB with demo data
pnpm start              # Start server on port 5000
```

### 3. Frontend Setup

```bash
cd frontend
cp .env.example .env    # Configure environment variables
pnpm install            # Install dependencies
pnpm run dev            # Start dev server on port 5173
```

### 4. Open the app

Navigate to **http://localhost:5173** in your browser.

---

## 🔐 Environment Variables

### Backend (`.env`)

| Variable | Default | Description |
|---|---|---|
| `PORT` | `5000` | Server port |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017/flowwise` | MongoDB connection string |
| `JWT_SECRET` | — | Secret key for JWT tokens |
| `JWT_EXPIRE` | `7d` | JWT token expiry |
| `CLIENT_URL` | `http://localhost:5173` | Frontend URL for CORS |
| `DEMO_MODE` | `true` | Enable demo mode (works without MongoDB) |

### Frontend (`.env`)

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5000/api` | Backend API base URL |
| `VITE_SOCKET_URL` | `http://localhost:5000` | Socket.IO server URL |
| `VITE_DEMO_MODE` | `true` | Enable demo mode UI indicators |

---

## 🎮 Demo Mode

FLOWWISE ships with a **fully functional demo mode** that works without MongoDB or any external APIs.

Demo mode provides:
- 15+ pre-configured locations around **Mathura & Vrindavan, Uttar Pradesh**
- Simulated crowd scores with time-based variation
- Sample route alternatives with realistic travel times
- Historical crowd data patterns
- Demo user account: `demo@flowwise.app` / `demo1234`

> ⚠️ Demo data is **simulated** and clearly labelled. It does not represent real-time sensor data.

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user (protected) |

### Journeys
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/journeys/plan` | Plan a journey |
| GET | `/api/journeys/history` | Get journey history (protected) |
| GET | `/api/journeys/:id` | Get specific journey |

### Crowd
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/crowd/nearby` | Get nearby crowd data |
| GET | `/api/crowd/location/:id` | Get location crowd info |
| POST | `/api/crowd/report` | Submit crowd report (protected) |
| GET | `/api/crowd/heatmap` | Get heatmap data |

### Prediction
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/prediction/forecast` | Get crowd forecast |

### Analytics
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/analytics/overview` | Analytics overview |
| GET | `/api/analytics/trends` | Crowd trends |

### Routes
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/routes/compare` | Compare route alternatives |

---

## 🧮 Route Scoring Algorithm

Routes are scored using a weighted formula:

$$\text{Route Score} = w_t \times T + w_c \times C + w_d \times D + w_r \times R$$

Where:
- **T** = Normalised Travel Time (0-100)
- **C** = Crowd Exposure (0-100)
- **D** = Normalised Distance (0-100)
- **R** = Reliability Penalty (0-100)

**Weight presets:**

| Mode | Time | Crowd | Distance | Reliability |
|---|---|---|---|---|
| Fastest | 0.70 | 0.15 | 0.10 | 0.05 |
| Least Crowded | 0.15 | 0.70 | 0.10 | 0.05 |
| Balanced | 0.35 | 0.45 | 0.10 | 0.10 |

Lower scores = better routes.

---

## 🏙 Demo Locations

The demo uses real locations from the Mathura-Vrindavan area:

- **Temples**: Banke Bihari, Prem Mandir, Krishna Janmabhoomi, ISKCON Vrindavan, Dwarkadhish, and more
- **Ghats**: Vishram Ghat, Kesi Ghat
- **Markets**: Holi Gate Market, Chatta Bazaar
- **Transit**: Mathura Junction Railway Station, Mathura Bus Stand
- **Heritage**: Kusum Sarovar, Radha Kund

---

## 🧪 Testing

```bash
# Start backend
cd backend && pnpm start

# In another terminal, start frontend
cd frontend && pnpm run dev

# Test the full user flow:
# 1. Register or use Demo Login (demo@flowwise.app / demo1234)
# 2. Plan a journey from Mathura Junction to Banke Bihari Temple
# 3. Compare routes and select one
# 4. View the crowd map
# 5. Submit a crowd report
# 6. Check analytics dashboard
```

---

## 📌 Important Notes

- Crowd data in demo mode is **simulated** and does not represent real-time conditions
- The prediction model uses a time-based heuristic; it is designed to be replaced by an ML model
- Route geometry uses straight-line segments between waypoints (not road-following)
- The OSRM integration is optional; the app works fully without it

---

## 🏆 Built For

This project was built as a hackathon prototype demonstrating crowd-aware intelligent navigation.

---

## 📄 License

MIT

---

**FLOWWISE** — Navigate Smarter. Travel Freer. 🧭
