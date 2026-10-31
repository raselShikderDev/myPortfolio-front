# Architectural Plan: Dynamic Resume Upload & Download Management

## 🎯 Goal
Allow the portfolio owner to upload and update their resume (PDF/doc) from the Admin Dashboard, enabling public visitors to download the latest uploaded resume dynamically by clicking the "Download Resume" button on the home page.

---

## 🛠️ Required Architectural Changes & Workflow

### 1. **Backend & Storage Options**
We need a place to store the uploaded resume file and its download URL metadata.

* **Option A: Store Resume File on Cloud (Cloudinary/ImageBB/Vercel Blob) + URL in DB**
  * *Upload:* Admin uploads PDF/document file -> Server uploads to cloud storage -> Saves the file URL/metadata in the database or profile settings.
  * *Download:* Public user clicks "Download Resume" -> Frontend triggers direct browser download from the URL or proxies through an API endpoint `/api/resume/download`.
* **Option B: Local/Server Asset Storage via Next.js API Route**
  * Resume is saved to Next.js public directory or served via a dedicated API route (`/api/resume`).

---

## 📋 Step-by-Step Implementation Breakdown

### **Phase 1: Backend / API Integration**
1. **Resume Upload Endpoint (`POST /api/resume/upload` or backend route):**
   * Endpoint for admin/owner to upload new resume file (PDF, max size ~5-10MB).
   * Validates file type (`.pdf`, `.doc`, `.docx`).
   * Updates/replaces the active resume link in the database or profile settings.

2. **Resume Retrieval Endpoint (`GET /api/resume` or included in `/users/getme` / profile endpoint):**
   * Public API endpoint returning current active resume URL.
   * `GET /api/resume/download` (optional) to serve the file with `Content-Disposition: attachment; filename="Rasel_Shikder_Resume.pdf"`.

---

### **Phase 2: Dashboard Admin UI (Manage Resume)**
1. **New Manage Resume Component / Settings Section:**
   * Create a form/modal in the Admin Dashboard (e.g., under `src/components/modules/owner/profile/` or dashboard settings page).
   * Shows current active resume status (file name, last updated date, preview/download link).
   * Single file uploader component with drag-and-drop support for PDF documents.
   * "Upload / Replace Resume" button with toast notification on success/error.

---

### **Phase 3: Public Home Page Integration**
1. **Dynamic Download Resume Button:**
   * Update the Home Page Hero section where the "Download Resume" button is located.
   * Fetch the current resume URL dynamically using Server Component data fetching or client fetch hook.
   * Configure the button click to trigger a direct download with a friendly filename:
     ```tsx
     <a
       href={resumeUrl}
       download="Rasel_Shikder_Resume.pdf"
       target="_blank"
       rel="noopener noreferrer"
     >
       <Button>Download Resume</Button>
     </a>
     ```

---

## 🔒 Security & Validation Requirements
- Admin authentication check (`Authorization` token validation) for resume uploads.
- Strict MIME type checking (`application/pdf`, `application/msword`).
- File size restriction (e.g., max 10MB).

---

## 🚀 Execution Order
1. **Task 1 (Current):** Complete ImageBB upload & CORS fixes.
2. **Task 2 (Next):** Implement dynamic resume upload & download feature using this saved plan.
