# AI Counsellor 🎓

A guided, stage-based platform designed to help students make confident and informed study-abroad decisions. Instead of overwhelming users with listings or generic chat responses, the platform uses a structured **AI Counsellor** that deeply understands a student's academic background, goals, budget, and readiness, and then guides them step by step from profile building to university shortlisting and application preparation.

## 🚀 Features

- **Strict Stage-Based Flow**: Each stage logically unlocks the next
- **Mandatory Onboarding**: Collects academic background, goals, budget, and exam readiness
- **AI Counsellor**: Understands profile, recommends universities, explains risks, and **takes actions**
- **University Discovery**: Filtered recommendations based on profile, budget, and country preferences
- **University Locking**: Commitment step required before application guidance
- **Application Guidance**: AI-generated tasks and document requirements
- **PostgreSQL Persistence**: All data persists across server restarts

## 🛠️ Tech Stack

- **Frontend**: React.js with React Router
- **Backend**: Node.js (Express)
- **Database**: PostgreSQL
- **AI**: Intent-based recommendations (ready for Gemini/LLM integration)

## 📋 Quick Start

See [SETUP.md](./SETUP.md) for detailed setup instructions.

### Quick Setup:

1. **Database**: Create PostgreSQL database and run `backend/sql/schema.sql`
2. **Backend**: 
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Update with your DB credentials
   npm run dev
   ```
3. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 🎯 Core Flow

1. Landing Page → Signup / Login
2. Mandatory Onboarding (4 steps)
3. Dashboard (stage indicators, profile strength, to-dos)
4. AI Counsellor (chat, recommendations, actions)
5. University Shortlisting
6. University Locking (required for application stage)
7. Application Guidance & To-Dos

## ✅ Hackathon Requirements Met

- ✅ Complete locked flow with stage-based unlocking
- ✅ Structured onboarding with completion gate
- ✅ AI Counsellor that takes actions (shortlist from chat)
- ✅ University discovery with profile-based filtering
- ✅ University locking enforcement
- ✅ Application guidance with actionable to-dos
- ✅ PostgreSQL database (scalable, reliable, well-structured)
- ✅ Clean UI/UX with smooth flow

## 📁 Project Structure

```
ai-counsellor/
├── backend/
│   ├── src/
│   │   ├── config/        # Database configuration
│   │   ├── controllers/   # Route handlers
│   │   ├── models/        # Database models
│   │   ├── routes/        # API routes
│   │   └── server.js      # Express server
│   ├── sql/
│   │   └── schema.sql     # Database schema
│   └── .env.example       # Environment variables template
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API service
│   │   └── App.js         # Main app component
│   └── public/
└── SETUP.md               # Detailed setup guide
```

## 🔑 Key Implementation Details

- **Onboarding Gate**: `onboarding_completed` flag must be `true` to access AI Counsellor
- **Lock Gate**: Application page requires at least one locked university
- **AI Actions**: Detects "shortlist [university]" intent and automatically adds to shortlist
- **Recommendations**: Uses GPA, budget range, and preferred countries for filtering
- **Stage Management**: Four stages (PROFILE_BUILDING → UNIVERSITY_DISCOVERY → UNIVERSITY_FINALIZATION → APPLICATION_PREP)

## 📝 Notes

- All critical data (shortlists, locks, todos) stored in PostgreSQL
- Frontend enforces gates with redirects and alerts
- Backend validates onboarding completion and locked university status
- Ready for deployment with environment variable configuration

## 🏆 Hackathon Submission

This project demonstrates:
- **Product clarity**: Clear understanding of the problem
- **Flow correctness**: Strict stage-based behavior
- **AI usefulness**: Actions, not just responses
- **UX clarity**: Intuitive, guided experience
- **Execution discipline**: Working end-to-end flow

---

Built with ❤️ for the AI Counsellor Hackathon
