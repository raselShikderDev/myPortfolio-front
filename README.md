# 🧑‍💻 My Portfolio Frontend

![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black?logo=nextdotjs)
![React](https://img.shields.io/badge/React-19.1.0-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4.0-38B2AC?logo=tailwindcss)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)
![License](https://img.shields.io/badge/license-MIT-blue)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)

---
## 🌐 Live Demo

👉 **Frontend:** [https://raselsdev.vercel.app](https://raselsdev.vercel.app)  
⚙️ **Backend API:** [https://rasel-shikder-backend.vercel.app](https://rasel-shikder-backend.vercel.app)

---
## 🧩 Overview

**MyPortfolio** is a fully dynamic personal portfolio website built with **Next.js 15**, **React 19**, and **TypeScript**. It allows the **owner** to manage the entire portfolio — including **projects**, **blogs**, **experiences**, and **profile details** — directly from a secure **admin panel** without writing any code.

This project showcases modern full-stack architecture and best practices for **dynamic portfolio management**.

---
## 🚀 Features

- 🧠 **Dynamic Portfolio Management** – Add, edit, and delete projects, blogs, and experiences without coding.
- 🔐 **Owner Admin Panel** – Secure login system with role-based access control for the site owner only.
- 🎨 **Modern UI/UX** – Built using TailwindCSS, Framer Motion, and Radix UI for accessibility and animations.
- ⚡ **Server Integration** – Connects seamlessly with backend APIs for CRUD operations.
- 🌙 **Theme Support** – Light/Dark mode support using `next-themes`.
- ✅ **Form Validation** – Implemented with `react-hook-form` and `zod`.
- 💬 **Notifications** – Real-time toast messages using `sonner`.
- 📱 **Responsive Design** – Fully responsive layout optimized for mobile and desktop.

---
## 🏗️ Tech Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript
- TailwindCSS 4
- Radix UI
- Framer Motion
- React Hook Form + Zod
- Next Themes (for dark mode)
- Lucide React Icons
- Sonner Toasts
- Custom UI Components

**Backend:**
- [Express + TypeScript + PostgreSQL](https://rasel-shikder-backend.vercel.app) (API server)
- JWT Authentication
- ImageBB for image uploads
- NextAuth for session management

**Deployment:**
- Vercel (Frontend)
- Render / Vercel (Backend)

---
## 📜 Architecture

### 1. Route Structure
The application uses a clear separation between public and owner (admin) routes:
- **Public Routes**: `/`, `/about`, `/blogs/[slug]`, `/contact`, `/projects`
- **Owner Routes**: `/owner/dashboard`, `/owner/manage-blogs`, `/owner/manage-experiences`, `/owner/manage-projects`

### 2. Authentication System
- **JWT-based authentication** with refresh tokens
- **Token verification** in middleware
- **Secure cookies** with httpOnly, secure, and sameSite flags
- **Role-based access control** for admin panel

### 3. API Integration
- **Centralized API configuration** in `src/lib/apiConfig.ts`
- **Type-safe API calls** using Zod schemas
- **Image upload** via ImageBB service
- **Form validation** with React Hook Form and Zod

### 4. Component Reusability
- **Radix UI components** for consistent UI patterns
- **Custom motion components** using Framer Motion
- **Reusable UI components** in `src/components/ui/`
- **Context providers** for theme and auth state

---
## 🗂️ Project Structure

```
myPortfolio-front/
├── src/
│   ├── app/
│   │   ├── (authentications)   # Authentication pages
│   │   │   └── login           # Login page
│   │   ├── (owner)             # Admin dashboard
│   │   │   ├── dashboard       # Admin dashboard
│   │   │   │   ├── manage-blogs          # Blog CRUD
│   │   │   │   ├── manage-experiences    # Experience CRUD
│   │   │   │   └── manage-projects      # Project CRUD
│   │   ├── (public)             # Public pages
│   │   │   ├── about             # About page
│   │   │   ├── blogs             # Blog list
│   │   │   │   └── [slug]       # Blog details
│   │   │   ├── contact           # Contact page
│   │   │   └── projects          # Projects page
│   │   └── api                  # API routes
│   │       ├── auth              # Auth endpoints
│   │       │   └── [...nextauth]   # NextAuth config
│   │       ├── blogs             # Blog endpoints
│   │       ├── profile           # Profile endpoints
│   │       ├── projects          # Project endpoints
│   │       └── stats             # Stats endpoints
│   ├── assets/                  # Static assets
│   │   ├── public               # Publicly accessible files
│   │   ├── services             # Service icons/images
│   │   └── works                 # Portfolio images
│   ├── components/              # React components
│   │   ├── modules/             # Feature-specific components
│   │   │   ├── about
│   │   │   ├── animations
│   │   │   ├── authentications
│   │   │   ├── blogs
│   │   │   ├── home
│   │   │   ├── layout
│   │   │   ├── owner
│   │   │   │   ├── blogs
│   │   │   │   ├── projects
│   │   │   │   └── workExperiences
│   │   │   ├── projects
│   │   │   └── ui               # General UI components
│   │   └── previewImage         # Image preview components
│   ├── helpers/                 # Helper functions
│   ├── hooks/                   # Custom React hooks
│   ├── interfaces/              # TypeScript interfaces
│   ├── lib/                     # Library functions
│   ├── provider/                # Context providers
│   ├── utils/                   # Utility functions
│   └── zodSchema/               # Validation schemas
└── package.json
```

---
## 📋 API Endpoints

### Authentication
- `POST /api/auth/generate-token` - Refresh access token
- `POST /api/auth/verify-token` - Verify JWT token
- `POST /api/auth/logout` - Logout and clear tokens

### Owner Endpoints
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project details
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

- `GET /api/blogs` - Get all blogs
- `POST /api/blogs` - Create new blog
- `GET /api/blogs/:id` - Get blog details
- `PUT /api/blogs/:id` - Update blog
- `DELETE /api/blogs/:id` - Delete blog

- `GET /api/experiences` - Get all work experiences
- `POST /api/experiences` - Create new experience
- `GET /api/experiences/:id` - Get experience details
- `PUT /api/experiences/:id` - Update experience
- `DELETE /api/experiences/:id` - Delete experience

### Public Endpoints
- `GET /api/profile` - Get user profile data
- `POST /api/upload-image` - Upload image to ImageBB

---
## 🏗️ Getting Started

### 1️⃣ Clone the repository
```bash
git clone https://github.com/raselShikderDev/myPortfolio-front.git
cd myPortfolio-front
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Set environment variables
Create a `.env.local` file in the root directory and add:
```env
GOOGLE_CLIENT_ID=<your_google_client-id>
GOOGLE_CLIENT_SECRET=<your_client_secret>
AUTH_SECRET=<your-auth_secret>
JWT_ACCESS_SECRET=<your_jwt_secret>
JWT_REFRESH_SECRET=<your_refresh_secret>
NEXT_PUBLIC_IMAGEBB_API_KEY=<your_imagebb_api>
NEXT_PUBLIC_IMAGEBB_API_LINK=<your_imagebb_api_link>
NEXT_PUBLIC_BASE_URL=<your_backend_api_url>
NEXTAUTH_SECRET=<your_secret>
```

### 4️⃣ Run the development server
```bash
npm run dev
```
Then visit 👉 [http://localhost:3000](http://localhost:3000)

---
## 🧠 Admin Panel Access

The admin panel is private and can be accessed only by the **portfolio owner**.  
To request admin credentials for collaboration or demo purposes, please contact:

📩 **Email:** [rasel.sikder777.rk@gmail.com](mailto:rasel.sikder777.rk@gmail.com)

---
## 📜 License

This project is licensed under the **MIT License** – you’re free to use and modify it with proper credit.

---
## 👨‍💻 Author

**Rasel Shikder**  
💼 Developer | MERN Stack | TypeScript | Next.js  
🌐 [GitHub Profile](https://github.com/raselShikderDev)  
📧 [rasel.sikder777.rk@gmail.com](mailto:rasel.sikder777.rk@gmail.com)

---
## ⭐ Support

If you like this project, consider giving it a **⭐ star** on [GitHub](https://github.com/raselShikderDev/myPortfolio-front) — it helps others find it too!