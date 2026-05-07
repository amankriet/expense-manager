import type { ThemeConfig } from "antd";

export const theme = {
  colors: {
    page: "#f6f3ee",
    surface: "#fffdf8",
    surfaceStrong: "#fffdf7",
    tableHeader: "#f7f2e8",
    tableHeaderText: "#667066",
    tableHover: "#faf6ee",
    input: "#fff",
    brand: "#26362f",
    brandDark: "#1f2d27",
    accent: "#d5f365",
    accentSoft: "#edf4d1",
    text: "#202721",
    textSoft: "#4c574f",
    mutedText: "#657169",
    mutedTextStrong: "#637063",
    inverseText: "#fffdf8",
    inverseTextSoft: "#d7ded2",
    border: "#e2dccf",
    borderStrong: "#d7d0c1",
    borderSoft: "#ebe5d9",
    danger: "#9a2d26",
    dangerBorder: "#e7c4bd",
    dangerSurface: "#fff1ee",
    success: "#2e7d32",
    successSurface: "#e8f5e9",
  },
  spacing: {
    xxs: "2px",
    xs: "4px",
    sm: "8px",
    md: "12px",
    lg: "16px",
    xl: "18px",
    "2xl": "22px",
    "3xl": "24px",
    "4xl": "32px",
    "5xl": "34px",
    "6xl": "48px",
  },
  radii: {
    md: "8px",
    lg: "18px",
  },
  sizes: {
    pageMax: "1220px",
    formColumn: "360px",
  },
  shadows: {
    card: "0 24px 80px rgba(45, 38, 25, 0.12)",
    fixedColumn: "-8px 0 12px -12px rgba(38, 54, 47, 0.35)",
    focus: "0 0 0 3px rgba(38, 54, 47, 0.12)",
    focusOutline: "3px solid rgba(38, 54, 47, 0.18)",
    lg: "0 12px 32px rgba(0, 0, 0, 0.16)",
  },
  breakpoints: {
    mobile: "560px",
    tablet: "860px",
  },
} as const;

export type AppTheme = typeof theme;

export const antdTheme: ThemeConfig = {
  token: {
    colorBgContainer: theme.colors.surface,
    colorBorderSecondary: theme.colors.borderSoft,
    colorPrimary: theme.colors.brand,
    colorText: theme.colors.text,
    colorTextHeading: theme.colors.brand,
    borderRadius: Number.parseInt(theme.radii.md, 10),
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  components: {
    Table: {
      headerBg: theme.colors.tableHeader,
      headerColor: theme.colors.tableHeaderText,
      rowHoverBg: theme.colors.tableHover,
    },
  },
};
