"use client";

// Removed next-auth SessionProvider. JWT-based auth is now handled via custom logic in src/lib/auth.ts and src/app/api/auth/generate-token/route.ts.

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  // Custom JWT-based auth provider (no next-auth dependency).
  return <>{children}</>;
}
