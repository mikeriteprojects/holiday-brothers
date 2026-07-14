import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./components/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "bg-deep": "var(--bg-deep)",
        "bg-deep-2": "var(--bg-deep-2)",

        "panel-glass": "var(--panel-glass)",
        "panel-glass-strong": "var(--panel-glass-strong)",
        "panel-border": "var(--panel-border)",
        "panel-border-strong": "var(--panel-border-strong)",

        "text-cream": "var(--text-cream)",
        "text-muted": "var(--text-muted)",
        "text-faint": "var(--text-faint)",

        amber: "var(--amber)",
        "amber-bright": "var(--amber-bright)",
        "gold-rim": "var(--gold-rim)",

        danger: "var(--danger)",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        body: ["var(--font-manrope)", "-apple-system", "sans-serif"],
        mono: ["var(--font-ibm-plex-mono)", "monospace"],
      },
      borderRadius: {
        lg: "var(--radius-lg)",
        md: "var(--radius-md)",
        sm: "var(--radius-sm)",
      },
      spacing: {
        6.5: "26px",
      },
      transitionDuration: {
        DEFAULT: "150ms",
      },
      backdropBlur: {
        glass: "18px",
      },
      boxShadow: {
        glass:
          "inset 0 1px 0 rgba(255, 224, 189, 0.12), inset 0 -12px 24px -16px rgba(0, 0, 0, 0.45), 0 18px 40px -12px rgba(0, 0, 0, 0.55)",
        "glass-btn":
          "inset 0 1px 0 rgba(255, 224, 189, 0.16), 0 10px 24px -10px rgba(0, 0, 0, 0.55)",
        "glass-btn-hover":
          "inset 0 1px 0 rgba(255, 224, 189, 0.22), 0 16px 32px -12px rgba(217, 138, 61, 0.35)",
      },
      backgroundImage: {
        page: "radial-gradient(ellipse at top, var(--bg-deep-2) 0%, var(--bg-deep) 60%)",
        "glass-panel":
          "linear-gradient(160deg, rgba(255, 224, 189, 0.1) 0%, rgba(255, 224, 189, 0.04) 100%)",
        "glass-btn-fill":
          "linear-gradient(160deg, rgba(244, 196, 138, 0.16) 0%, rgba(244, 196, 138, 0.05) 100%)",
      },
    },
  },
  plugins: [],
};
export default config;
