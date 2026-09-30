# MyPortfolio Frontend, Project Context

## Project

This repository is the frontend for my personal portfolio application.

Repository:
https://github.com/raselShikderDev/myPortfolio-front

Primary branch for current development:
v2

Framework:
Next.js 15, App Router

Language:
TypeScript

Runtime/package manager:
Bun

## Main Technology Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Hook Form
- Zod
- Redux Toolkit where already used
- Bun

Do not introduce another framework or state-management solution unless explicitly required.

## Existing Architecture

src/
├── actions/
├── app/
├── components/
├── interfaces/
├── lib/
├── utils/
└── assets/

The project uses the Next.js App Router.

Server Components and Server Actions are already used.

Do not convert Server Components to Client Components unless required by the current task.

Do not add "use client" merely to solve a local problem.

## Main Application Areas

Public pages:

- Home
- About
- Projects
- Blogs
- Blog details
- Contact

Dashboard:

- Dashboard
- Manage Blogs
- Manage Projects
- Manage Experiences

Authentication:

- Existing custom authentication system
- Existing cookie-based authentication flow

API:
The frontend communicates with the existing portfolio backend.

Do not change backend API contracts from frontend tasks unless the current task explicitly requires it.

## API Configuration

The centralized API configuration is:

src/lib/apiConfig.ts

Use the existing API configuration.

Do not reintroduce scattered environment-variable access.

Do not invent API endpoints.

Do not change endpoint paths unless explicitly required.

## Image Upload

The existing application uses ImageBB for image uploads.

Do not replace the image provider unless explicitly requested.

## Rich Text

The current roadmap will introduce Tiptap.

Tiptap is NOT currently considered implemented unless the relevant roadmap task has been completed.

Do not install or configure Tiptap before its designated roadmap task.

## Current Roadmap

1. Environment & API Configuration
2. API Layer & Error Handling
3. Authentication Hardening
4. Form Validation & Security
5. Tiptap Rich Text Editor
6. Rich Text Dashboard Integration
7. Rich Text Rendering & XSS Safety
8. Image Upload & Media Handling
9. Type Safety & Code Quality
10. Performance & Next.js Optimization
11. Testing & Production Verification
12. Final Security & Production Review

Current task:
Prompt 02, API Layer & Error Handling

Prompt 01 has already been completed.

Do not redo completed roadmap work unless the current task requires compatibility changes.
