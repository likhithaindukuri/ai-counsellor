# AI Counsellor - Setup Guide

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Database Setup

1. **Create PostgreSQL Database:**
   ```bash
   createdb ai_counsellor
   ```

2. **Run Schema Script:**
   ```bash
   cd backend
   psql -U your_db_user -d ai_counsellor -f sql/schema.sql
   ```
   
   Or manually execute the SQL in `backend/sql/schema.sql` using pgAdmin or psql.

## Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update database credentials in `.env`:
     ```
     DB_USER=your_db_user
     DB_HOST=localhost
     DB_NAME=ai_counsellor
     DB_PASSWORD=your_db_password
     DB_PORT=5432
     PORT=5000
     ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   
   The server will run on `http://localhost:5000`

## Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Update API base URL (if needed):**
   - Edit `src/services/api.js` if your backend runs on a different port or host
   - Default: `http://localhost:5000/api`

4. **Start the frontend:**
   ```bash
   npm start
   ```
   
   The app will open at `http://localhost:3000`

## Testing the Flow

1. **Landing Page** → Click "Get Started"
2. **Signup** → Create an account
3. **Onboarding** → Complete all 4 steps (mandatory)
4. **Dashboard** → View your profile and stage
5. **AI Counsellor** → Chat and get recommendations
6. **Shortlist** → Add universities to shortlist
7. **Lock University** → Lock at least one university
8. **Application** → View tasks and guidance

## Key Features

- ✅ **Strict Stage-Based Flow**: Each stage unlocks the next
- ✅ **Onboarding Gate**: AI Counsellor locked until onboarding complete
- ✅ **University Locking**: Application guidance requires locked university
- ✅ **AI Actions**: AI can shortlist universities from chat
- ✅ **PostgreSQL Persistence**: All data persists across restarts
- ✅ **Profile-Based Recommendations**: Uses GPA, budget, and country preferences

## Troubleshooting

### Database Connection Issues
- Ensure PostgreSQL is running
- Verify credentials in `.env` file
- Check if database `ai_counsellor` exists

### Port Already in Use
- Change `PORT` in backend `.env` file
- Update frontend `api.js` baseURL accordingly

### CORS Issues
- Ensure backend CORS is enabled (already configured)
- Check that frontend and backend URLs match

## Deployment Notes

- Set `NODE_ENV=production` in production
- Use environment variables for all sensitive data
- Ensure PostgreSQL is accessible from your deployment server
- Update frontend API baseURL to production backend URL
