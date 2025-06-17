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
  extend: {},
 },
 plugins: [],
};
