import { useState } from "react";
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
import styled from "styled-components";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const response = await apiClient.post("/auth/forgot-password", {
        email,
      });

      setSuccessMessage(
        response.data.message || "Password reset link sent successfully",
      );

      setEmail("");
    } catch (err: any) {
      setError(err?.response?.data?.message || "Something went wrong");
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

            <AuthTitle>Forgot Password</AuthTitle>

            <AuthDescription>
              Enter your email address to receive a password reset link.
            </AuthDescription>
          </div>
        </FormHeader>

        <form onSubmit={handleSubmit}>
          <AuthStack>
            <Field>
              Email
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Field>

            {error && <InlineError>{error}</InlineError>}
            {successMessage && <InlineSuccess>{successMessage}</InlineSuccess>}

            <PrimaryButton type="submit" disabled={loading}>
              {loading ? "Sending reset link..." : "Send Reset Link"}
            </PrimaryButton>
          </AuthStack>
        </form>

        <AuthFooterText>
          Remembered your password? <AuthLink to="/signin">Sign in</AuthLink>
        </AuthFooterText>
        <AuthFooterText>
          New here? <AuthLink to="/signup">Create account</AuthLink>
        </AuthFooterText>
      </AuthCard>
    </AuthContainer>
  );
}

const InlineSuccess = styled.p`
  margin: 0;
  padding: 10px ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.successSurface};
  color: ${({ theme }) => theme.colors.success};
  font-weight: 700;
`;
