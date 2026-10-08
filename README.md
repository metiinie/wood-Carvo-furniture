# WOOD CARVO — Furniture Workshop Showcase & Inquiry Website

WOOD CARVO is a bespoke furniture workshop based in Addis Ababa, Ethiopia.
Slogan: *"Your Vision, Our Craft"*

This platform is a fast, lightweight showcase and inquiry website designed for Ethiopian mobile networks, featuring bilingual/trilingual internationalization (English, Amharic, Afaan Oromo), phone-friendly workshop administration, automated Telegram broadcasting, and WhatsApp direct inquiry flows.

---

## 🏗 Architecture & Stack

- **Monorepo Structure**:
  - `backend/`: Django 5, Django REST Framework, django-unfold (admin), django-modeltranslation, drf-spectacular, gunicorn, whitenoise.
  - `frontend/`: Next.js (App Router), TypeScript, Tailwind CSS, next-intl (locale routing: `/en`, `/am`, `/om`), edge ISR caching.
- **Languages Supported**:
  - English (`en`)
  - Amharic (`am`) - Ethiopic script (loaded conditionally)
  - Afaan Oromo (`om`) - Latin script (Qubee)
- **Deployment**:
  - Backend: Render Web Service (Free tier + Uptime ping to `/healthz` or `/api/v1/healthz`)
  - Frontend: Vercel with edge ISR
  - Database: External PostgreSQL (Neon / Supabase)
  - Media: Cloudinary CDN

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Python 3.12+ (or 3.13)
- Node.js 18+ (Node 20+ recommended)
- `git`

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
# source .venv/bin/activate

pip install -r requirements.txt
cp .env.example .env

# Run migrations & seed initial demo data
python manage.py migrate
python manage.py seed_data

# Start local development server
python manage.py runserver 0.0.0.0:8000
```
- Admin panel available at: `http://localhost:8000/manage/`
- Health check: `http://localhost:8000/api/v1/healthz`
- OpenAPI Swagger documentation: `http://localhost:8000/api/v1/docs/`

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
```
- Web application available at: `http://localhost:3000/`

---

## 🔐 Environment Variables

### Backend (`backend/.env`)
| Variable | Description | Default |
|---|---|---|
| `SECRET_KEY` | Django secret key | (Required) |
| `DEBUG` | Enable debug mode | `True` locally |
| `ALLOWED_HOSTS` | Comma-separated hosts | `localhost,127.0.0.1` |
| `DATABASE_URL` | PostgreSQL connection URL | Uses SQLite if unset |
| `CLOUDINARY_URL` | Cloudinary credentials | Optional for local dev |
| `CORS_ORIGIN` | Frontend origin(s) | `http://localhost:3000` |
| `FRONTEND_URL` | Frontend URL for revalidation | `http://localhost:3000` |
| `REVALIDATE_SECRET`| Shared secret for Next.js ISR tag purge | (Generate random string) |
| `TELEGRAM_BOT_TOKEN` | Bot token for channel auto-posting | Optional |
| `TELEGRAM_CHANNEL_ID` | Telegram channel username or ID | Optional |

### Frontend (`frontend/.env.local`)
| Variable | Description | Default |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public site domain | `http://localhost:3000` |
| `API_URL` | Backend API base URL | `http://localhost:8000` |
| `REVALIDATE_SECRET` | Secret matching backend | (Secret) |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default locale | `en` |

---

## 🚢 Production Deployment

### Backend on Render
1. Create a **Web Service** pointing to the repository root with directory `backend`.
2. Build command: `./build.sh`
3. Start command: `gunicorn config.wsgi:application --bind 0.0.0.0:$PORT`
4. Connect external Postgres from Neon or Supabase via `DATABASE_URL`.
5. Set environment variables from `.env.example`.
6. Configure an uptime ping service (e.g. UptimeRobot, BetterStack) targeting `https://<backend-app>.onrender.com/api/v1/healthz` every 10 minutes to prevent cold starts.

### Frontend on Vercel
1. Import repository and set root directory to `frontend`.
2. Framework: **Next.js**.
3. Set environment variables (`API_URL`, `NEXT_PUBLIC_SITE_URL`, `REVALIDATE_SECRET`).
