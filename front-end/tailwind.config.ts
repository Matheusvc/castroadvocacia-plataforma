import type { Config } from "tailwindcss";
import { colors, fonts, fontSize, radii } from "./src/theme";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: colors.blue,
        fuschia: colors.fuschia,
        gray: colors.gray,
        surface: colors.surface,
        "border-light": colors.borderLight,
        "bubble-received": colors.bubbleReceived,
        "bubble-sent": colors.bubbleSent,
        danger: colors.danger,
        status: colors.status,
      },
      fontFamily: {
        sans: [...fonts.sans],
      },
      fontSize: fontSize as unknown as Config["theme"],
      borderRadius: {
        sm: radii.sm,
        bubble: radii.bubble,
        content: radii.content,
        shell: radii.shell,
      },
      boxShadow: {
        card: "0 1px 2px rgba(21, 22, 25, 0.04), 0 2px 8px rgba(21, 22, 25, 0.05)",
        "card-hover": "0 6px 16px rgba(21, 22, 25, 0.10)",
      },
      keyframes: {
        "typing-bounce": {
          "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.4" },
          "30%": { transform: "translateY(-4px)", opacity: "1" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(6px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "typing-bounce": "typing-bounce 1.2s infinite ease-in-out",
        "fade-in-up": "fade-in-up 180ms ease-out both",
      },
    },
  },
  plugins: [],
} satisfies Config;
