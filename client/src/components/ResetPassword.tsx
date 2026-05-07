import { useState } from "react";
import { message } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { apiClient } from "../api/http";
import {
  AuthCard,
  AuthContainer,
  AuthDescription,
  AuthFooterText,
  AuthLink,
  AuthStack,
  AuthTitle,
} from "../components/AuthStyledComponents";
import {
  Field,
  FormHeader,
  InlineError,
  LogoMark,
  PrimaryButton,
} from "../components/StyledComponents";
import { getErrorMessage } from "../utils/helpers";

export default function ResetPassword() {
  const navigate = useNavigate();

  const location = useLocation();

  const token = new URLSearchParams(location.search).get("token");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      setLoading(true);

      await apiClient.post("/auth/reset-password", {
        token,
        password,
      });

      message.success("Password reset successful");

      navigate("/signin");
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContainer>
      <AuthCard>
        <FormHeader>
          <div>
            <LogoMark>EM</LogoMark>

            <AuthTitle>Reset Password</AuthTitle>

            <AuthDescription>Enter your new password below.</AuthDescription>
          </div>
        </FormHeader>

        <form onSubmit={handleSubmit}>
          <AuthStack>
            <Field>
              New Password
              <input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Field>

            <Field>
              Confirm Password
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </Field>

            {error && <InlineError>{error}</InlineError>}

            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Resetting password..." : "Reset Password"}
            </PrimaryButton>
          </AuthStack>
        </form>

        <AuthFooterText>
          Back to <AuthLink to="/signin">Sign in</AuthLink>
        </AuthFooterText>
      </AuthCard>
    </AuthContainer>
  );
}
