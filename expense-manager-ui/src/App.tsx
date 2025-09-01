import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { AuthProvider } from "./context/auth-context";
import Dashboard from "./pages/Dashboard/Dashboard";
import SignIn from "./components/SignIn";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/signin" element={<SignIn />} />
          <Route path="*" element={<SignIn />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
