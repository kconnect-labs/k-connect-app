/** @type {import('tailwindcss').Config} */
module.exports = {
 content: [
  "./app/**/*.{js,jsx,ts,tsx}",
  "./ui/**/*.{js,jsx,ts,tsx}",
  "./components/**/*.{js,jsx,ts,tsx}",
  "./features/**/*.{js,jsx,ts,tsx}",
  "./hooks/**/*.{js,jsx,ts,tsx}",
 ],
 presets: [require("nativewind/preset")],
 theme: {
  extend: {
   fontFamily: {
    sans: ["SFProDisplay-Regular", "ui-sans-serif", "system-ui"],
    bold: ["SFProDisplay-Bold"],
    semibold: ["SFProDisplay-Semibold"],
    medium: ["SFProDisplay-Medium"],
   },
   colors: {
    primary: "var(--theme-main-color)",
    'primary-button': "var(--theme-button-main)",
    background: "var(--theme-background)",
    'background-full': "var(--theme-background-full)",
    'background-site': "var(--theme-site-background)",
    textPrimary: "var(--theme-text-primary)",
    textSecondary: "var(--theme-text-secondary)",
    textAccent: "var(--theme-text-accent)",
    textError: "var(--theme-text-error)",
    textSuccess: "var(--theme-text-success)",
    textWarning: "var(--theme-text-warning)",
    textInfo: "var(--theme-text-info)",
    // Legacy colors for backward compatibility
    secondary: "#1e1e2e",
    accent: "#b0b0b0",
    error: "#ff6b6b",
    surface: "#1a1a2e",
   },
   borderRadius: {
    'theme-main': "var(--main-border-radius)",
    'theme-small': "var(--small-border-radius)",
    'theme-large': "var(--large-border-radius)",
   },
   backdropBlur: {
    theme: "var(--theme-backdrop-filter)",
   },
  },
 },
 plugins: [],
};
