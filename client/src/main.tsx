import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { ConfigProvider } from "antd";
import { antdTheme, theme } from "./theme/index.ts";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./api/interceptors.ts";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});

const GlobalStyle = createGlobalStyle`
  :root {
    color: ${({ theme }) => theme.colors.text};
    background: ${({ theme }) => theme.colors.page};
  }

  button:focus-visible,
  input:focus-visible,
  select:focus-visible,
  textarea:focus-visible {
    outline: ${({ theme }) => theme.shadows.focusOutline};
  }
`;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <ConfigProvider theme={antdTheme}>
          <App />
        </ConfigProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
