-- AI Counsellor Database Schema
-- PostgreSQL Database Setup Script

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_education VARCHAR(255),
  graduation_year INTEGER,
  target_degree VARCHAR(255),
  preferred_countries TEXT[], -- Array of countries
  budget_range VARCHAR(255),
  ielts_status VARCHAR(50) DEFAULT 'Not started',
  gre_gmat_status VARCHAR(50) DEFAULT 'Not started',
  sop_status VARCHAR(50) DEFAULT 'Not started',
  gpa DECIMAL(3,2),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User stages table
CREATE TABLE IF NOT EXISTS user_stages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  current_stage VARCHAR(50) NOT NULL DEFAULT 'PROFILE_BUILDING',
  updated_at TIMESTAMP DEFAULT NOW()
);

-- University shortlists table
CREATE TABLE IF NOT EXISTS university_shortlists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  university_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, university_name)
);

-- Locked universities table
CREATE TABLE IF NOT EXISTS locked_universities (
  id SERIAL PRIMARY KEY,
  user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  university_name VARCHAR(255) NOT NULL,
  locked_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- User todos table
CREATE TABLE IF NOT EXISTS user_todos (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_stages_user_id ON user_stages(user_id);
CREATE INDEX IF NOT EXISTS idx_shortlists_user_id ON university_shortlists(user_id);
CREATE INDEX IF NOT EXISTS idx_locked_user_id ON locked_universities(user_id);
CREATE INDEX IF NOT EXISTS idx_todos_user_id ON user_todos(user_id);
