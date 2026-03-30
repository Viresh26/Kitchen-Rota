# Kitchen-Rota

A web application to manage and track shared cleaning responsibilities for your kitchen. Built with Next.js, Prisma, and TypeScript.

## Features

- **User Authentication**: Secure login and registration system
- **Task Management**: Create, edit, and delete cleaning tasks with customizable frequency and priority
- **Schedule Management**: Create rotating cleaning schedules
- **Task Assignment**: Assign tasks to users with automatic rotation
- **Completion Tracking**: Mark tasks as complete and track history
- **Dashboard**: View statistics and upcoming tasks
- **Admin Panel**: Manage users and roles
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: SQLite (development), PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **Deployment**: Heroku-ready

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd kitchen-rota
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Generate a secret key for NextAuth:
```bash
openssl rand -base64 32
```
Add the generated key to your `.env` file as `NEXTAUTH_SECRET`.

5. Set up the database:
```bash
npx prisma migrate dev --name init
```

6. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment to Heroku

### Prerequisites

- Heroku CLI installed
- Heroku account

### Steps

1. Create a new Heroku app:
```bash
heroku create your-app-name
```

2. Add the PostgreSQL addon:
```bash
heroku addons:create heroku-postgresql:mini
```

3. Set environment variables:
```bash
heroku config:set NEXTAUTH_URL=https://your-app-name.herokuapp.com
heroku config:set NEXTAUTH_SECRET=your-secret-key
```

4. Deploy:
```bash
git push heroku main
```

5. Open the app:
```bash
heroku open
```

## Project Structure

```
kitchen-rota/
├── prisma/
│   └── schema.prisma       # Database schema
├── src/
│   ├── app/
│   │   ├── api/            # API routes
│   │   ├── dashboard/      # Dashboard page
│   │   ├── tasks/          # Tasks management
│   │   ├── schedules/      # Schedules management
│   │   ├── admin/          # Admin panel
│   │   ├── login/          # Login page
│   │   ├── register/       # Registration page
│   │   └── layout.tsx      # Root layout
│   ├── components/
│   │   ├── ui/             # Reusable UI components
│   │   └── Sidebar.tsx     # Navigation sidebar
│   ├── lib/
│   │   ├── auth.ts         # Auth configuration
│   │   └── prisma.ts       # Prisma client
│   ├── types/
│   │   └── index.ts        # TypeScript types
│   └── utils/
│       └── helpers.ts      # Utility functions
├── .env.example            # Environment variables template
├── Procfile                # Heroku deployment config
└── package.json
```

## Database Schema

The application uses the following main entities:

- **User**: User accounts with roles (USER/ADMIN)
- **CleaningTask**: Cleaning task definitions
- **Schedule**: Cleaning schedules with rotation types
- **Assignment**: Task assignments to users
- **Completion**: Task completion records
- **Notification**: User notifications

## Color Scheme

- **Primary**: `#1275e2` - Main brand color for CTAs and key elements
- **Secondary**: `#5f78a3` - Supporting color for accents
- **Tertiary**: `#c55b00` - Accent color for highlights
- **Neutral**: `#74777f` - Base color for text and surfaces

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see [LICENSE](LICENSE) for details.

## Acknowledgments

Built with ❤️ for cleaner kitchens everywhere.
