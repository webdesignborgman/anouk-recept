/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    // Voeg extra paden toe als je elders ook componenten/pages hebt
  ],
  theme: {
    extend: {
      colors: {
        primary: 'hsl(var(--color-primary) / <alpha-value>)',
        'primary-foreground': 'hsl(var(--color-primary-foreground) / <alpha-value>)',
        secondary: 'hsl(var(--color-secondary) / <alpha-value>)',
        'secondary-foreground': 'hsl(var(--color-secondary-foreground) / <alpha-value>)',
        background: 'hsl(var(--color-background) / <alpha-value>)',
        foreground: 'hsl(var(--color-foreground) / <alpha-value>)',
        card: 'hsl(var(--color-card) / <alpha-value>)',
        'card-foreground': 'hsl(var(--color-card-foreground) / <alpha-value>)',
        accent: 'hsl(var(--color-accent) / <alpha-value>)',
        muted: 'hsl(var(--color-muted) / <alpha-value>)',
        'muted-foreground': 'hsl(var(--color-muted-foreground) / <alpha-value>)',
        destructive: 'hsl(var(--color-destructive) / <alpha-value>)',
        border: 'hsl(var(--color-border) / <alpha-value>)',
        input: 'hsl(var(--color-input) / <alpha-value>)',
      },
      backgroundImage: {
        'gradient-primary': 'var(--background-image-primary)',
        'gradient-secondary': 'var(--background-image-secondary)',
        'gradient-accent': 'var(--background-image-accent)',
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        medium: 'var(--shadow-medium)',
      },
      borderRadius: {
        DEFAULT: 'var(--radius)',
        lg: 'var(--radius)',
      },
    },
  },
  plugins: [],
};
