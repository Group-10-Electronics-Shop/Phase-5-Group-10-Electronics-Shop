module.exports = {
  content: ['./index.html','./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#0b1724',     // deep neutral for headings
        accent: '#f97316',      // warm orange CTA (inferred from sale emphasis)
        gold: '#D4AF37',        // voucher / premium accent
        danger: '#ef4444',
        success: '#10b981',
        muted: '#6b7280',
      },
      fontFamily: {
        sans: ['Inter','ui-sans-serif','system-ui','sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem'
      },
      boxShadow: {
        card: '0 8px 24px rgba(11,15,25,0.08)'
      }
    }
  },
  plugins: [],
}