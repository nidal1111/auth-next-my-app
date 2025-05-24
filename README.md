# Next.js Authentication App

A complete authentication application built with Next.js 15, TypeScript, and SQLite, implementing a secure registration and login system with JWT tokens.

## 🚀 Key Features

- **Complete Authentication**: User registration and login system with email/password
- **Advanced Security**: 
  - Password hashing with bcrypt
  - JWT tokens with 24h expiration
  - HTTP-only cookies for session management
- **Route Protection**: Custom middleware to protect private areas
- **Form Validation**: Schema validation with Zod
- **Modern UI**: Custom components based on Radix UI and Tailwind CSS
- **Local Database**: SQLite with Drizzle ORM for simple setup

## 🛠️ Tech Stack

- **Framework**: [Next.js 15.1.8](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: SQLite with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication**: JWT ([jose](https://github.com/panva/jose)) + bcryptjs
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Radix UI](https://www.radix-ui.com/) + custom components
- **Validation**: [Zod](https://zod.dev/)

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/auth/          # Authentication API routes
│   ├── dashboard/         # Protected area
│   ├── sign-in/          # Login page
│   └── sign-up/          # Registration page
├── components/            # Reusable UI components
│   └── ui/               # Base components (Button, Input, etc.)
├── lib/                   # Utilities and core logic
│   ├── auth.ts           # Authentication logic
│   ├── db/               # Database schema and connection
│   ├── utils.ts          # Utility functions
│   └── validations.ts    # Zod validation schemas
└── middleware.ts          # Route protection
```

## 🚀 Installation and Setup

### Prerequisites

- Node.js 18+ 
- npm, yarn, pnpm, or bun

### Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/nidal1111/auth-next-my-app.git
   cd auth-next-my-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Generate a secure JWT secret:
   ```bash
   openssl rand -base64 32
   ```
   
   Paste the generated value in `.env.local`:
   ```
   JWT_SECRET=your_generated_secret
   ```

4. **Initialize the database**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Create production build
- `npm run start` - Start production server
- `npm run lint` - Run code linting
- `npm run db:push` - Sync database schema
- `npm run db:studio` - Open Drizzle Studio to explore the DB

## 🔐 Security Architecture

### Authentication Flow

1. **Registration**:
   - User enters email, password, and name
   - Password is hashed with bcrypt (10 rounds)
   - User is saved to database
   - JWT token is generated and stored in HTTP-only cookie

2. **Login**:
   - Credentials verified against database
   - Password comparison with bcrypt
   - JWT token generation with 24h expiration
   - HTTP-only cookie for session

3. **Route Protection**:
   - Middleware intercepts requests to `/dashboard`
   - Verifies JWT token validity
   - Automatic redirects for unauthenticated users

### Design Decisions

- **JWT over server sessions**: Scalability and statelessness
- **HTTP-only cookies**: Protection from XSS attacks
- **SQLite**: Simplicity for development/small apps
- **Drizzle ORM**: Type-safety and performance
- **Edge Middleware**: Fast token verification at edge level

## 🎨 UI Components

UI components follow the composition pattern with variants managed by CVA (class-variance-authority):

- **Button**: Supports variants (default, destructive, outline, etc.) and sizes
- **Input**: Input field with error state support
- **PasswordInput**: Password input with visibility toggle
- **Label**: Accessible labels for forms

## 📝 API Endpoints

### POST `/api/auth/sign-up`
Register a new user.

**Body**:
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

### POST `/api/auth/sign-in`
Authenticate an existing user.

**Body**:
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### POST `/api/auth/logout`
Terminate the current session.

### GET `/api/auth/me`
Get authenticated user information.

## 🧪 Testing

To test the application:

1. Register a new account from `/sign-up` page
2. Login with created credentials
3. Verify access to protected dashboard
4. Test logout and route protection

## 🚀 Deployment

### Vercel (Recommended)

**Important**: This app uses SQLite locally but requires Postgres on Vercel since SQLite doesn't work in serverless environments.

1. **Push code to GitHub**

2. **Import project on [Vercel](https://vercel.com)**

3. **Set up Vercel Postgres** (Required):
   - Go to your Vercel project dashboard
   - Navigate to "Storage" tab
   - Click "Create Database" → Select "Postgres"
   - Choose a database name and region
   - This automatically adds all required `POSTGRES_*` environment variables

4. **Add environment variables**:
   - Go to Settings → Environment Variables
   - Add `JWT_SECRET`:
     ```bash
     # Generate a secure secret locally:
     openssl rand -base64 32
     ```
   - Paste the generated value as `JWT_SECRET`

5. **Deploy the project**:
   - Vercel will automatically deploy your project
   - The API routes include `export const runtime = 'nodejs'` for compatibility

6. **Initialize the database** (after first deployment):
   ```bash
   # Install Vercel CLI if needed
   npm i -g vercel
   
   # Link to your project
   vercel link
   
   # Pull environment variables
   vercel env pull .env.local
   
   # Run production migration
   npm run db:push:prod
   ```

**Troubleshooting**:
- If you get 405 errors, ensure Vercel Postgres is set up
- Check that all `POSTGRES_*` variables are present in your Vercel dashboard
- Verify `JWT_SECRET` is set in environment variables

### Self-hosting

1. Build the project:
   ```bash
   npm run build
   ```

2. Configure environment variables in production

3. Start the server:
   ```bash
   npm run start
   ```

## 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
