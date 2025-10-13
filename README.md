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

**MyPortfolio** is a fully dynamic personal portfolio website built with **Next.js 15**, **React 19**, and **TypeScript**.  
It allows the **owner** to manage the entire portfolio — including **projects**, **blogs**, **experiences**, and **profile details** — directly from a secure **admin panel** without writing any code.

This project showcases modern full-stack architecture and best practices for **dynamic portfolio management**.

---

## 🚀 Features

- 🧠 **Dynamic Portfolio Management** – Add, edit, and delete projects, blogs, and experiences without coding.
- 🔐 **Owner Admin Panel** – Secure login system with access control for the site owner only.
- 🎨 **Modern UI/UX** – Built using TailwindCSS, Framer Motion, and Radix UI for accessibility and animations.
- ⚡ **Server Integration** – Connects seamlessly with backend APIs for CRUD operations.
- 🌙 **Theme Support** – Light/Dark mode support using `next-themes`.
- ✅ **Form Validation** – Implemented with `react-hook-form` and `zod`.
- 💬 **Notifications** – Real-time toast messages using `sonner`.

---

## 🏗️ Tech Stack

**Frontend:**

- Next.js 15 (Turbopack)
- React 19
- TypeScript
- TailwindCSS 4
- Radix UI
- Framer Motion
- React Hook Form + Zod
- Next Themes
- Lucide React Icons
- Sonner Toasts

**Backend:**

- [Express + TypeScript + PostgreSQL](https://rasel-shikder-backend.vercel.app)

**Deployment:**

- Vercel (Frontend)
- Render / Vercel (Backend)

---

## 🗂️ Project Structure

```
myPortfolio-front/

├── src/
---actions        # helper functions
---app            # main app pages
|   --- (authentications)    # auth pages
|   |   \---login             # login page
|   --- (owner)               # admin pages
|   |   \---dashboard         # admin dashboard
|   |       --- manage-blogs          # blog CRUD
|   |       --- manage-experiences    # experience CRUD
|   |       \--- manage-projects      # project CRUD
|   --- (public)             # public pages
|   |   --- about             # about page
|   |   --- blogs             # blog list
|   |   |   \--- [slug]       # blog details
|   |   --- contact           # contact page
|   |   \--- projects         # projects page
|   \--- api                  # API routes
|       --- auth              # auth endpoints
|       |   \--- [...nextauth]   # NextAuth config
|       --- blogs             # blog endpoints
|       --- profile           # profile endpoints
|       --- projects          # project endpoints
|       \--- stats            # stats endpoints
---assets          # static assets
|   --- public        # publicly accessible files
|   --- services      # service icons/images
|   \--- works         # portfolio images
---components      # React components
|   --- modules       # feature-specific components
|   |   --- about
|   |   --- animations
|   |   --- authentications
|   |   --- blogs
|   |   --- home
|   |   --- layout
|   |   --- owner
|   |   |   --- blogs
|   |   |   --- projects
|   |   |   \--- workExperiences
|   |   --- projects
|   --- previewImage  # image preview components
|   \--- ui           # general UI components
---helpers         # helper functions
---hooks           # custom React hooks
---interfaces      # TypeScript interfaces
---lib             # library functions
---provider        # context providers
---utils           # utility functions
\---zodSchema      # validation schemas

```

---

## ⚙️ Getting Started

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
NEXT_PUBLIC_IMAGEBB_API_KEY=<your_imagebb_api>
NEXT_PUBLIC_IMAGEBB_API_LINK=<your_imagebb_api_link>
NEXT_PUBLIC_BASE_URL=<your_backend_api_url>
NEXTAUTH_SECRET=<your_secret>
```

### 4️⃣ Run the development server

```bash
npm run dev
bun run dev
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
