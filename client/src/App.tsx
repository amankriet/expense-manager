import type { ReactNode } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/auth-context";
import { useAuth } from "./hooks/use-auth";
import NotFound from "./pages/NotFound";
import AuthScreen from "./components/AuthScreen";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/signin" element={<AuthScreen mode="signin" />} />
          <Route path="/signup" element={<AuthScreen mode="signup" />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/404" element={<NotFound />} />
          <Route
            path="/"
            element={
              <ProtectedPage>
                <Dashboard />
              </ProtectedPage>
            }
          />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function ProtectedPage({ children }: { children: ReactNode }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/signin" replace />;
}

export default App;
