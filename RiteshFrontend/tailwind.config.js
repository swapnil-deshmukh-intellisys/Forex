/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Background Colors
        'bg-primary': '#0f172a',     // Deep navy - Main background
        'bg-secondary': '#1e293b',   // Dark slate - Secondary background
        'card-bg': '#1e1e2e',        // Darker card background
        
        // Text Colors
        'text-primary': '#f8fafc',   // Off-white - Primary text
        'text-secondary': '#cbd5e1', // Cool gray - Secondary text
        'text-tertiary': '#94a3b8',  // Dim gray - Tertiary text
        'text-quaternary': '#ffffff', // Pure white - Quaternary text
        
        // Accent Colors
        'accent-color': '#14b8a6',   // Teal - Primary accent
        'accent-light': '#2dd4bf',   // Light teal - Light accent
        'primary-blue': '#7c3aed',   // Purple - Primary blue accent
        'golden': '#facc15',         // Yellow gold accent
        
        // Border and Shadow Colors
        'border-color': '#334155',   // Slate gray - Borders
        'shadow-color': 'rgba(124, 58, 237, 0.2)', // Purple shadow
        'hover-bg': '#334155',       // Hover dark slate
        
        // Utility Colors
        'chart-grid': '#475569',     // Dark grid lines
        'success-color': '#22c55e',  // Green - Success states
        'danger-color': '#ef4444',   // Red - Error states
        
        // Legacy colors for backward compatibility
        'forest-green': '#14b8a6',   // Replaced with teal
        'sky-blue': '#7c3aed',       // Replaced with purple
        'off-white': '#0f172a',      // Replaced with dark navy
        'graph-grey': '#94a3b8',     // Dim gray
      },
      fontFamily: {
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
