/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#0d0d12',
                card: '#16161c',
                primary: '#4ade80',    // Green for complete
                danger: '#ef4444',     // Red for missed
                warning: '#eab308',    // Yellow for partial
                accent: '#8b5cf6',     // Purple for highlights
                muted: '#3f3f46',      // Gray for inactive mapping
            },
            animation: {
                'glow': 'glow 2s ease-in-out infinite alternate',
            },
            keyframes: {
                glow: {
                    '0%': { boxShadow: '0 0 5px rgba(74, 222, 128, 0.2)' },
                    '100%': { boxShadow: '0 0 20px rgba(74, 222, 128, 0.6)' },
                }
            }
        },
    },
    plugins: [],
}
