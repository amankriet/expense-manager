export const theme = {
  colors: {
    primary: "#0066ff",
    secondary: "#00b894",
    danger: "#e74c3c",
    background: "#f5f5f5",
    text: "#2c2c2c",
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
  },
  radii: {
    sm: "4px",
    md: "8px",
    lg: "12px",
  },
} as const;

export type AppTheme = typeof theme;
