# Kitchen-Rota - Project Functionality Documentation

## Project Overview
**Kitchen-Rota** is a web application designed to manage and track shared cleaning responsibilities for a kitchen. The project is built as a collaborative tool for organizing cleaning schedules among multiple users.

---

## Current Project Status
**Status:** Initial Setup / Fresh Start  
**Last Updated:** March 30, 2026

---

## Existing Infrastructure & Configuration

### 1. Environment Configuration (`.env`)
- **Purpose:** Stores environment variables for the application
- **Current Configuration:**
  - `DATABASE_URL="file:./dev.db"` - SQLite database configuration for local development
- **Notes:** Uses Prisma ORM for database management

### 2. TypeScript Configuration (`next-env.d.ts`)
- **Purpose:** Provides TypeScript type definitions for Next.js
- **Features:**
  - Global type references for Next.js
  - Image types support
  - Route types integration
  - Compatible with Next.js App Router

### 3. Package Management (`package-lock.json`)
- **Purpose:** Lock file for npm dependencies
- **Current State:** Minimal configuration (no dependencies installed yet)

### 4. License (`LICENSE`)
- **Type:** MIT License
- **Copyright:** 2025 Viresh
- **Permissions:** Free to use, modify, distribute, and sell

### 5. Documentation (`README.md`)
- **Purpose:** Project description and overview
- **Content:** Basic project description

---

## Planned/Intended Functionalities

Based on the project name and initial setup, the following functionalities are intended for implementation:

### Core Features (To Be Implemented)

#### 1. User Management
- User registration and authentication
- User profiles
- Role-based access control

#### 2. Cleaning Schedule Management
- Create and manage cleaning rota schedules
- Assign cleaning tasks to users
- Rotating schedule system
- Calendar view of cleaning duties

#### 3. Task Tracking
- Mark tasks as complete
- Track completion history
- Overdue task notifications
- Task verification system

#### 4. Notifications & Reminders
- Email notifications for upcoming tasks
- Reminder system for overdue tasks
- Push notifications (optional)

#### 5. Reporting & Analytics
- Cleaning completion statistics
- User participation reports
- Historical data tracking

#### 6. Admin Features
- Manage users
- Configure schedule settings
- Override assignments
- View all activity logs

---

## Technical Stack (Planned)

### Frontend
- **Framework:** Next.js (React)
- **Language:** TypeScript
- **Styling:** To be determined
- **State Management:** To be determined

### Backend
- **Runtime:** Node.js
- **Database:** SQLite (local development), PostgreSQL (required for Heroku production)
- **ORM:** Prisma
- **Authentication:** To be determined

### Infrastructure & Deployment
- **Version Control:** Git
- **Package Manager:** npm
- **Environment:** dotenv
- **Hosting Platform:** Heroku

### Heroku Deployment Requirements
- **Procfile:** Required to define the dyno start command (e.g., `web: npm start`).
- **Dynamic Port Binding:** The application must bind to `process.env.PORT` provided by Heroku.
- **Database Support:** Heroku's filesystem is ephemeral. SQLite cannot be used in production; Heroku Postgres add-on is mandatory.
- **File Storage:** Any uploaded files or images must be stored in external cloud storage (e.g., AWS S3, Cloudinary). Local file uploads will be lost when dynos restart.
- **Build & Release Steps:** `package.json` must include proper build scripts, and Prisma migrations (e.g., `npx prisma migrate deploy`) should run in the release phase.

---

## Database Schema (Planned)

The following database tables are expected to be implemented:

1. **Users** - User accounts and profiles
2. **CleaningTasks** - Defined cleaning tasks
3. **Schedules** - Rota schedule definitions
4. **Assignments** - User-task assignments
5. **Completions** - Task completion records
6. **Notifications** - Notification logs

---

## Git History

| Commit Hash | Author | Date | Message |
|-------------|--------|------|---------|
| 028a857 | Snehal Kashetti | Nov 19, 2025 | I dont know what this will do |
| f691c7d | Viresh | Oct 9, 2025 | Initial commit |

---

## Current File Structure

```
kitchen-rota/
├── .env                 # Environment variables (SQLite DB config)
├── .git/                # Git repository
├── LICENSE              # MIT License
├── next-env.d.ts        # Next.js TypeScript definitions
├── node_modules/        # Dependencies (minimal)
├── package-lock.json    # npm lock file
└── README.md            # Project readme
```

---

## Next Steps for Development

1. **Setup Phase**
   - [ ] Install core dependencies (Next.js, React, Prisma)
   - [ ] Configure TypeScript properly
   - [ ] Set up project structure (src/, app/, components/)
   - [ ] Create `.gitignore` file

2. **Database Phase**
   - [ ] Define Prisma schema
   - [ ] Run initial migrations
   - [ ] Seed database with test data

3. **Authentication Phase**
   - [ ] Implement user authentication
   - [ ] Create login/register pages
   - [ ] Set up session management

4. **Core Features Phase**
   - [ ] Build cleaning task CRUD operations
   - [ ] Implement schedule management
   - [ ] Create assignment system
   - [ ] Build task completion tracking

5. **UI/UX Phase**
   - [ ] Design responsive layouts
   - [ ] Create dashboard views
   - [ ] Implement calendar components
   - [ ] Add notification system

6. **Testing & Deployment (Heroku)**
   - [ ] Write unit and integration tests
   - [ ] Create a `Procfile` for Heroku web/release dynos
   - [ ] Provision Heroku Postgres database add-on
   - [ ] Configure environment variables in Heroku Dashboard (Config Vars)
   - [ ] Set up proper build/start scripts in `package.json`
   - [ ] Set up CI/CD pipeline (e.g., GitHub Actions to Heroku or automatic Heroku deploys)
   - [ ] Deploy to Heroku production environment

---

## Notes

- This document was generated during a project reset to preserve knowledge of intended functionality
- The project is being reset to start fresh due to previous issues
- All future development should reference this document for feature planning
- Update this document as new features are implemented

---

**Document Generated:** March 30, 2026  
**Project Reset:** Yes - Starting fresh
