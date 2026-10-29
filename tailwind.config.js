const { fontFamily } = require('tailwindcss')

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-outfit)', 'var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: 'hsl(var(--primary))',
        primaryForeground: 'hsl(var(--primary-foreground))',
        secondary: 'hsl(var(--secondary))',
        secondaryForeground: 'hsl(var(--secondary-foreground))',
        muted: 'hsl(var(--muted))',
        mutedForeground: 'hsl(var(--muted-foreground))',
        accent: 'hsl(var(--accent))',
        accentForeground: 'hsl(var(--accent-foreground))',
        destructive: 'hsl(var(--destructive))',
        card: 'hsl(var(--card))',
        cardForeground: 'hsl(var(--card-foreground))',
        popover: 'hsl(var(--popover))',
        popoverForeground: 'hsl(var(--popover-foreground))',
        sidebar: 'hsl(var(--sidebar))',
        sidebarForeground: 'hsl(var(--sidebar-foreground))',
        sidebarPrimary: 'hsl(var(--sidebar-primary))',
        sidebarPrimaryForeground: 'hsl(var(--sidebar-primary-foreground))',
        sidebarAccent: 'hsl(var(--sidebar-accent))',
        sidebarAccentForeground: 'hsl(var(--sidebar-accent-foreground))',
        sidebarBorder: 'hsl(var(--sidebar-border))',
        sidebarRing: 'hsl(var(--sidebar-ring))',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    require('@tailwindcss/typography'),
  ],
}
