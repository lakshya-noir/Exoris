# Exoris - NASA Media Explorer

Exoris is an interactive space exploration app built during the NASA Space Apps challenge context. It combines:

- a React frontend for immersive exploration,
- a Django REST backend for NASA-powered search and data APIs,
- and 3D experiences for the solar system and Earth.

The project is designed for fast visual discovery of celestial imagery and educational storytelling.

## Features

- NASA image search from the home screen with gallery-style results
- Full-screen image preview modal
- Interactive 3D Solar System scene (`react-three-fiber` + `three.js`)
- Planet information modal with curated summaries
- Standalone Earth 3D model experience under `public/earth-3d/`
- Backend API for:
  - NASA image search
  - popular searches
  - APOD (Astronomy Picture of the Day)
  - datasets/annotations/metadata endpoints
  - map tile serving

## Tech Stack

### Frontend

- React (`react-scripts`, Create React App)
- React Router
- `@react-three/fiber` and `@react-three/drei`
- OpenSeadragon (assets/utilities)
- Custom CSS

### Backend

- Django 5
- Django REST Framework
- `django-cors-headers`
- SQLite (default local DB)
- Requests-based integrations with NASA APIs

## Project Structure

```text
exoris/
├─ src/                           # React app
│  ├─ App.jsx                     # Main router
│  ├─ pages/Home.jsx              # Landing page + search entry
│  ├─ components/
│  │  ├─ SearchBar.jsx
│  │  ├─ ImageModal.jsx
│  │  └─ solar-system-3d/
│  │     ├─ SolarSystemPage.jsx
│  │     └─ PlanetInfoModal.jsx
│  └─ styles/components.css
├─ public/
│  └─ earth-3d/                   # Standalone Earth 3D experience
├─ nasa-backend/
│  ├─ manage.py
│  ├─ backend/
│  │  ├─ settings.py
│  │  └─ urls.py
│  └─ api/
│     ├─ views.py
│     ├─ models.py
│     └─ nasa_services.py
└─ package.json
```

## Prerequisites

- Node.js 18+ and npm
- Python 3.10+ (recommended)
- `pip` and virtual environment tooling

## Local Development Setup

Run frontend and backend in separate terminals.

### 1) Clone and install frontend dependencies

```bash
git clone <your-repo-url>
cd exoris
npm install
```

### 2) Set up backend virtual environment

```bash
cd nasa-backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 3) Run Django migrations

```bash
python manage.py migrate
```

### 4) Start backend server

```bash
python manage.py runserver 8000
```

Backend will run at `http://127.0.0.1:8000`.

### 5) Start frontend server

In a new terminal:

```bash
cd exoris
npm start
```

Frontend will run at `http://localhost:3000`.

Because `package.json` defines `"proxy": "http://localhost:8000"`, frontend requests to `/api/...` are proxied to Django during local development.

## Available Frontend Routes

- `/` - Home page and NASA media search
- `/solar-system` - Interactive 3D solar system
- `/earth-3d/index.html` - Earth model page (opens separately)

## API Endpoints (Backend)

Base URL (local): `http://127.0.0.1:8000`

- `GET /` - API root with endpoint listing
- `GET /api/search/nasa/?q=<query>&limit=<n>&page=<p>` - NASA image search (with pagination)
- `GET /api/nasa/image/<nasa_id>/` - NASA image details from cached results
- `GET /api/search/popular/` - most popular search terms
- `GET /api/nasa/apod/?date=YYYY-MM-DD` - APOD (date optional)
- `GET /api/search/?q=<term>` - search annotation features
- `GET /api/datasets/` - datasets list
- `GET /api/annotations/` - annotations CRUD
- `GET /api/metadata/` - image metadata list
- `GET /tiles/<dataset>/<z>/<x>/<y>.<png|jpg>` - tile serving

## Environment and Configuration Notes

- Django settings are in `nasa-backend/backend/settings.py`.
- CORS is currently fully open in development (`CORS_ALLOW_ALL_ORIGINS = True`).
- Database defaults to SQLite (`db.sqlite3`) for local development.
- NASA API key is currently configured in settings; for production, move secrets to environment variables.

## Scripts

From repo root:

- `npm start` - run frontend dev server
- `npm run build` - production frontend build
- `npm test` - run frontend tests

From `nasa-backend/`:

- `python manage.py runserver` - run backend API
- `python manage.py migrate` - apply DB migrations
- `python manage.py createsuperuser` - create Django admin user

## Troubleshooting

### Port conflicts

- If port `3000` is busy, stop conflicting frontend process or allow CRA to pick another port.
- If port `8000` is busy, run Django on another port and update frontend proxy accordingly.

### API calls fail from frontend

- Confirm backend is running first.
- Verify frontend proxy in `package.json`.
- Check browser devtools network tab for failing endpoint paths.

### GitHub push fails with large files

- Ensure `node_modules/` and cache directories are in `.gitignore`.
- Remove large artifacts from tracked history before pushing.

## Roadmap Ideas

- Add authentication for user annotations
- Move secrets to environment variables and `.env` files
- Add test coverage for backend endpoints and React components
- Add deployment configs (Docker + cloud hosting)

## License

This project is open source and available under the [MIT License](LICENSE).
