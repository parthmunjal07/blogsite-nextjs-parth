# Blogsite

A modern, full-stack blogging platform built with **Next.js 16 (App Router)**. This project offers a comprehensive set of features including authentication, role-based access control, markdown support, rich text handling, and analytics for views and likes.

## 🚀 Tech Stack & Architecture

This project is built using modern web development tools and best practices:

- **Framework:** [Next.js 16](https://nextjs.org/) (React 19) utilizing the App Router (`app/` directory).
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/) for utility-first styling.
- **Database:** [PostgreSQL](https://www.postgresql.org/) (compatible with serverless Postgres providers like Neon).
- **ORM:** [Prisma](https://www.prisma.io/) for type-safe database access and schema management.
- **Authentication:** [Auth.js (NextAuth v5 beta)](https://authjs.dev/) supporting secure sessions, JWTs, and `bcrypt` for credentials.
- **File Uploads:** [UploadThing](https://uploadthing.com/) for managing cover images and assets.
- **Emails:** [Resend](https://resend.com/) for transactional emails (e.g., verification, password resets).
- **Content Rendering:** `react-markdown`, `remark-gfm`, and `rehype-raw` with `isomorphic-dompurify` for safe, rich markdown rendering.
- **Tracking:** FingerprintJS for anonymous view and like tracking.

### 🗄️ Database Schema Overview

The database is structured around the following core entities:
- **User:** Manages authentication, profiles, and roles (`SUPER_ADMIN`, `BLOG_CREATOR`, `PUBLIC_VIEWER`).
- **Post:** The core blogging model with markdown content, view counts, and relationships to authors and categories.
- **Category:** Groups posts by topics.
- **Comment:** Nested discussions on posts.
- **Like & PostView:** Tracks user engagement. Uses browser fingerprinting for non-authenticated user interactions.

---

## 🛠️ Getting Started Locally

Follow these steps to set up and run the project on your local machine.

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- A PostgreSQL database (you can use local Postgres, Docker, or a service like Neon/Supabase)

### 2. Clone and Install
Clone the repository and install the dependencies:
```bash
npm install
# or yarn install / pnpm install
```

### 3. Environment Variables
Create a `.env` file in the root of your project. You can use the following template based on the required services:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/blogsite"

# Authentication Secrets
# Generate secrets using: openssl rand -base64 32
JWT_SECRET="your-jwt-secret"
AUTH_SECRET="your-auth-secret"

# UploadThing (File Uploads)
UPLOADTHING_SECRET="your-uploadthing-secret"
UPLOADTHING_APP_ID="your-uploadthing-app-id"

# Resend (Emails)
RESEND_API_KEY="your-resend-api-key"
```

### 4. Database Setup
Push the Prisma schema to your database to create the necessary tables:
```bash
npx prisma db push
```

*(Optional)* Seed the database with initial data (like default categories or admin users) if a seed file is configured:
```bash
npx prisma db seed
```

### 5. Run the Development Server
Start the Next.js development server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

---

## 📂 Project Structure

- `app/` - Next.js App Router containing pages, layouts, and API routes (`(auth)`, `(public)`, `(admin)` route groups).
- `components/` - Reusable React components (UI, layouts, forms).
- `prisma/` - Prisma schema (`schema.prisma`) and database seed scripts.
- `lib/` / `utils/` - Helper functions, database client initialization, and configuration files.
- `actions/` - Next.js Server Actions for handling form submissions and data mutations.

## 📜 Commands

- `npm run dev`: Starts the development server.
- `npm run build`: Builds the app for production.
- `npm start`: Runs the production server.
- `npm run lint`: Lints the code using ESLint.
