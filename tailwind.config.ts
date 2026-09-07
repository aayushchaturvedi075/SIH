import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#000a1e",
        "primary-container": "#002147",
        "on-primary": "#ffffff",
        "on-primary-container": "#708ab5",
        "primary-fixed": "#d6e3ff",
        "primary-fixed-dim": "#aec7f6",
        "on-primary-fixed": "#001b3d",
        "on-primary-fixed-variant": "#2d476f",
        "inverse-primary": "#aec7f6",

        secondary: "#3a5f94",
        "secondary-container": "#9fc2fe",
        "on-secondary": "#ffffff",
        "on-secondary-container": "#294f83",
        "secondary-fixed": "#d5e3ff",
        "secondary-fixed-dim": "#a7c8ff",
        "on-secondary-fixed": "#001b3c",
        "on-secondary-fixed-variant": "#1f477b",

        tertiary: "#160700",
        "tertiary-container": "#371a00",
        "on-tertiary": "#ffffff",
        "on-tertiary-container": "#cd7200",
        "tertiary-fixed": "#ffdcc2",
        "tertiary-fixed-dim": "#ffb77a",
        "on-tertiary-fixed": "#2e1500",
        "on-tertiary-fixed-variant": "#6d3a00",
        saffron: "#ff9933",
        "saffron-dark": "#cd7200",

        navy: {
          700: "#1e3a6a",
          800: "#0e2246",
          900: "#051329",
          950: "#020a17",
        },

        surface: "#f9f9f9",
        "surface-dim": "#dadada",
        "surface-bright": "#f9f9f9",
        "surface-container-lowest": "#ffffff",
        "surface-container-low": "#f3f3f3",
        "surface-container": "#eeeeee",
        "surface-container-high": "#e8e8e8",
        "surface-container-highest": "#e2e2e2",
        "surface-variant": "#e2e2e2",
        "surface-tint": "#465f88",
        "on-surface": "#1a1c1c",
        "on-surface-variant": "#44474e",
        "inverse-surface": "#2f3131",
        "inverse-on-surface": "#f1f1f1",

        background: "#f9f9f9",
        "on-background": "#1a1c1c",

        outline: "#74777f",
        "outline-variant": "#c4c6cf",

        error: "#ba1a1a",
        "on-error": "#ffffff",
        "error-container": "#ffdad6",
        "on-error-container": "#93000a",

        success: "#15803d",
        "success-container": "#dcfce7",
        "on-success": "#ffffff",
        "on-success-container": "#166534",

        warning: "#d97706",
        "warning-container": "#fef3c7",
        "on-warning-container": "#92400e",
      },
      fontFamily: {
        sans: ["Noto Sans", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        "body-lg": ["Noto Sans", "sans-serif"],
        "body-md": ["Noto Sans", "sans-serif"],
        "body-sm": ["Noto Sans", "sans-serif"],
        "headline-md": ["Noto Sans", "sans-serif"],
        "headline-sm": ["Noto Sans", "sans-serif"],
        "display-lg": ["Noto Sans", "sans-serif"],
        "label-caps": ["Noto Sans", "sans-serif"],
        "data-mono": ["JetBrains Mono", "monospace"],
      },
      borderRadius: {
        DEFAULT: "0.25rem",
        sm: "0.125rem",
        md: "0.375rem",
        lg: "0.5rem",
        xl: "0.75rem",
      },
      spacing: {
        unit: "4px",
        gutter: "16px",
        margin: "24px",
      },
    },
  },
  plugins: [],
};
export default config;
