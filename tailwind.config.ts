import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // 定义我们的品牌色
        primary: {
          DEFAULT: '#F97316', // 充满活力的橙色
          '600': '#EA580C',
        },
        // 定义背景和文本色
        background: '#F8FAFC', // 几乎是白色，但更温暖
        foreground: '#0F172A', // 非常深的石板色，代替纯黑
        muted: {
          DEFAULT: '#64748B', // 用于次要文本的灰色
          foreground: '#94A3B8',
        },
      },
      // 定义圆角
      borderRadius: {
        lg: '0.75rem',
        xl: '1rem',
      },
      // 定义动画
      animation: {
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.6s ease-out forwards',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config; 