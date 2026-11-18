import type { Config } from "tailwindcss";

/**
 * Brand: "Garden Home" — garden green, Sophie's golden, warm cream.
 * Colours are CSS variables (src/index.css) so a theme change is one file.
 */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: { center: true, padding: "1rem", screens: { "2xl": "1200px" } },
    extend: {
      colors: {
        garden: { DEFAULT: "hsl(var(--garden))", dark: "hsl(var(--garden-dark))", soft: "hsl(var(--garden-soft))" },
        sophie: { DEFAULT: "hsl(var(--sophie))", ink: "hsl(var(--sophie-ink))" },
        cream: "hsl(var(--cream))",
        bark: "hsl(var(--bark))",
        muted: "hsl(var(--muted))",
        line: "hsl(var(--line))",
        sand: "hsl(var(--sand))",
        clay: { DEFAULT: "hsl(var(--clay))", soft: "hsl(var(--clay-soft))" },
      },
      fontFamily: {
        display: ["Fraunces", "Noto Sans Tamil", "Georgia", "serif"],
        sans: ["Nunito", "Noto Sans Tamil", "system-ui", "sans-serif"],
        tamil: ["Noto Sans Tamil", "Nunito", "sans-serif"],
      },
      borderRadius: { xl: "14px", "2xl": "18px" },
    },
  },
  plugins: [],
} satisfies Config;
