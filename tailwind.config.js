/** @type {import('tailwindcss').Config} */
module.exports = {
    // NOTE: Update this to include the paths to all files that contain Nativewind classes.
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./screens/**/*.{js,jsx,ts,tsx}", "./app/product/**/*.{js,jsx,ts,tsx}", "./app/collections/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    theme: {
        extend: {
            colors: {
                'primary': '#2c2f6a',
                'secondary': '#4bb6ff',
            }
        },
    },
    plugins: [],
}