// tailwind.config.ts
import { Config } from "tailwindcss";

export default {
    // 다크모드를 클래스 기준(html 태그에 .dark가 붙었을 때)으로 켤 것인지 결정
    darkMode: "class",

    content: [
        "./app/**/*.{js,jsx,ts,tsx}",
        "./components/**/*.{js,jsx,ts,tsx}",
        "./types/**/*.{js,jsx,ts,tsx}",
    ],

    presets: [require("nativewind/preset")],
    plugins: [],

    theme: {
        extend: {
            maxWidth: {
                "250": "1000px",
            },

            colors: {
                background: {
                    default: "var(--bg-default)",
                    paper: "var(--bg-paper)",
                    light: "var(--bg-light)",
                },

                text: {
                    default: "var(--text-default)",
                    secondary: "var(--text-secondary)",
                },

                divider: "var(--divider)",

                primary: {
                    main: "var(--primary-main)",
                    contrast: "var(--primary-contrast)",
                    light: "var(--primary-light)",
                },
                secondary: {
                    main: "var(--secondary-main)",
                    contrast: "var(--secondary-contrast)",
                    point: "var(--secondary-point)",
                },
                error: {
                    main: "var(--error-main)",
                    contrast: "var(--error-contrast)",
                    point: "var(--error-point)",
                },
                success: {
                    main: "var(--success-main)",
                    contrast: "var(--success-contrast)",
                    point: "var(--success-point)",
                },
                warning: {
                    main: "var(--warning-main)",
                    contrast: "var(--warning-contrast)",
                },
                info: {
                    main: "var(--info-main)",
                    contrast: "var(--info-contrast)",
                },
            },
        },
    },

    safelist: [
        {
            pattern:
                /(bg|text|border)-(primary|secondary|error|success|warning|info|text)-(main|contrast|secondary|light|point)/,
        },
    ],
} satisfies Config;
