// tailwind.config.ts
import { Config } from "tailwindcss";

export default {
    // 1. 다크모드를 클래스 기준(html 태그에 .dark가 붙었을 때)으로 켤 것인지 결정
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
                },

                text: {
                    default: "var(--text-default)",
                    secondary: "var(--text-secondary)",
                },

                divider: "var(--divider)",

                primary: {
                    main: "var(--primary-main)",
                    contrast: "var(--primary-contrast)",
                },
                secondary: {
                    main: "var(--secondary-main)",
                    contrast: "var(--secondary-contrast)",
                },
                error: {
                    main: "var(--error-main)",
                    contrast: "var(--error-contrast)",
                },
                success: {
                    main: "var(--success-main)",
                    contrast: "var(--success-contrast)",
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
                /(bg|text|border)-(primary|secondary|error|success|warning|info)-(main|contrast)/,
        },
    ],
} satisfies Config;
