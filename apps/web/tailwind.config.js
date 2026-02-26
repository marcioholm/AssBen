/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#1c8f48',
                    foreground: '#ffffff',
                },
                accent: {
                    DEFAULT: '#fbf32f',
                    foreground: '#1c8f48',
                },
                brand: {
                    green: '#1c8f48',
                    yellow: '#fbf32f',
                },
            },
        },
    },
    plugins: [],
}
