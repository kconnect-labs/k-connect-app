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
    primary: "#6366f1",
    secondary: "#1e1e2e",
    accent: "#b0b0b0",
    error: "#ff6b6b",
    background: "#0f0f23",
    surface: "#1a1a2e",
    textPrimary: "#ffffff",
    textSecondary: "#b0b0b0",
   },
  },
 },
 plugins: [],
};
