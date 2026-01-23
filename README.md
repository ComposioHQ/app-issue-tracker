# App Issue Tracker Dashboard

A production-ready dashboard for tracking app integration issues with API pricing analysis.

**Live URL:** https://app-issue-tracker.vercel.app (after deployment)

## Architecture

```
Browser → Vercel (Frontend + API) → Supabase (PostgreSQL)
```

- **Frontend**: Static HTML + Tailwind CSS + Vanilla JS
- **Backend**: Vercel serverless function (config endpoint)
- **Database**: Supabase PostgreSQL with Row Level Security

## Setup

### 1. Supabase Configuration

The app uses an existing Supabase project. Run the schema SQL to create tables:

```bash
# In Supabase SQL Editor, run:
cat data/schema.sql
```

### 2. Environment Variables

Set these in Vercel:

| Variable | Description |
|----------|-------------|
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous/public key |

### 3. Data Migration

Migrate existing JSON data to Supabase:

```bash
cd app-issue-tracker
npm install
SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_KEY=xxx npm run migrate
```

### 4. Local Development

```bash
# Install Vercel CLI
npm i -g vercel

# Run locally (auto-loads .env)
vercel dev
```

### 5. Deploy to Vercel

```bash
vercel --prod
```

## Project Structure

```
app-issue-tracker/
├── index.html          # Main dashboard (Supabase-integrated)
├── api/
│   └── config.js       # Serves Supabase credentials
├── data/
│   ├── schema.sql      # Database schema
│   ├── migrate.js      # Data migration script
│   └── enriched_results.json  # Source data
├── vercel.json         # Vercel configuration
└── package.json        # Project dependencies
```

## Features

- **Team Filtering**: View QA vs Partnerships issues
- **Cost Categories**: Free, Low, Medium, High, Enterprise, Credits
- **Issue Tracking**: Mark individual issues as solved (persisted in Supabase)
- **Search & Sort**: Filter by name, cost, affected actions
- **Progress Indicators**: Visual progress bars for partially solved apps

## Database Schema

### `apps` table
Stores app data including pricing info, issues, and team assignments.

### `solved_issues` table
Tracks which issues have been marked as solved (replaces localStorage).
