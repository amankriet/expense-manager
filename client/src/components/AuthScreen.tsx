import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../hooks/use-auth";
import { useState, type FormEvent } from "react";
import type { SignInSignUpResponse, SignUpRequest } from "../types/auth";
import { useMutation } from "@tanstack/react-query";
import { signInApi, signUpApi } from "../api/auth";
import {
  Eyebrow,
  Field,
  FormHeader,
  InlineError,
  LogoMark,
  PrimaryButton,
  TwoColumn,
} from "./StyledComponents";
import { getErrorMessage } from "../utils/helpers";

function AuthScreen({ mode }: { mode: "signin" | "signup" }) {
  const navigate = useNavigate();
  const { signin } = useAuth();
  const isSignup = mode === "signup";
  const [errorMessage, setErrorMessage] = useState("");
  const [form, setForm] = useState<SignUpRequest>({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    dob: "",
    password: "",
    role: "user",
  });

  const authMutation = useMutation<SignInSignUpResponse, Error>({
    mutationFn: () => {
      if (isSignup) {
        return signUpApi(form);
      }

      return signInApi({
        email: form.email,
        password: form.password,
      });
    },
    retry: 0,
    onSuccess: (data) => {
      signin(data.tokens.accessToken, data.user, () =>
        navigate("/", { replace: true }),
      );
    },
    onError: (error) => setErrorMessage(getErrorMessage(error)),
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    authMutation.mutate();
  };

  return (
    <AuthPage>
      <BrandPanel>
        <LogoMark>EM</LogoMark>
        <AuthTitle>
          {isSignup ? "Create your account" : "Welcome back"}
        </AuthTitle>
        <AuthCopy>
          Track income and expenses with a focused dashboard built for quick
          daily updates.
        </AuthCopy>
      </BrandPanel>

      <AuthCard onSubmit={handleSubmit}>
        <FormHeader>
          <div>
            <Eyebrow>{isSignup ? "Sign up" : "Sign in"}</Eyebrow>
            <h1>{isSignup ? "Start managing money" : "Open your dashboard"}</h1>
          </div>
        </FormHeader>

        {isSignup && (
          <TwoColumn>
            <Field>
              <span>First name</span>
              <input
                required
                value={form.firstName}
                onChange={(event) =>
                  setForm({ ...form, firstName: event.target.value })
                }
              />
            </Field>
            <Field>
              <span>Last name</span>
              <input
                required
                value={form.lastName}
                onChange={(event) =>
                  setForm({ ...form, lastName: event.target.value })
                }
              />
            </Field>
          </TwoColumn>
        )}

        <Field>
          <span>Email</span>
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
          />
        </Field>

        {isSignup && (
          <TwoColumn>
            <Field>
              <span>Mobile</span>
              <input
                required
                inputMode="numeric"
                value={form.mobile}
                onChange={(event) =>
                  setForm({ ...form, mobile: event.target.value })
                }
              />
            </Field>
            <Field>
              <span>Date of birth</span>
              <input
                required
                type="date"
                value={form.dob}
                onChange={(event) =>
                  setForm({ ...form, dob: event.target.value })
                }
              />
            </Field>
          </TwoColumn>
        )}

        <Field>
          <span>Password</span>
          <input
            required
            minLength={6}
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
          />
        </Field>

        {errorMessage && <InlineError>{errorMessage}</InlineError>}

        <PrimaryButton type="submit" disabled={authMutation.isPending}>
          {authMutation.isPending
            ? "Please wait..."
            : isSignup
              ? "Create account"
              : "Sign in"}
        </PrimaryButton>

        <SwitchText>
          {isSignup ? "Already have an account?" : "New here?"}{" "}
          <button
            type="button"
            onClick={() =>
              navigate(isSignup ? "/signin" : "/signup", { replace: true })
            }
          >
            {isSignup ? "Sign in" : "Create account"}
          </button>
        </SwitchText>
      </AuthCard>
    </AuthPage>
  );
}

export default AuthScreen;

const AuthPage = styled.main`
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(280px, 0.9fr) minmax(320px, 1.1fr);
  background: ${({ theme }) => theme.colors.page};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    grid-template-columns: 1fr;
  }
`;

const BrandPanel = styled.section`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing["6xl"]};
  background: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.surfaceStrong};

  @media (max-width: ${({ theme }) => theme.breakpoints.tablet}) {
    padding: ${({ theme }) => theme.spacing["4xl"]}
      ${({ theme }) => theme.spacing["3xl"]};
  }
`;

const AuthTitle = styled.h2`
  max-width: 480px;
  margin: 0;
  font-size: clamp(2.2rem, 4vw, 4rem);
  line-height: 1;
`;

const AuthCopy = styled.p`
  max-width: 420px;
  margin: 0;
  color: ${({ theme }) => theme.colors.inverseTextSoft};
  font-size: 1.05rem;
`;

const AuthCard = styled.form`
  align-self: center;
  justify-self: center;
  width: min(440px, calc(100% - 40px));
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing["4xl"]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    padding: ${({ theme }) => theme.spacing["3xl"]};
    margin: ${({ theme }) => theme.spacing["3xl"]} 0;
  }
`;

const SwitchText = styled.p`
  margin: 0;
  text-align: center;
  color: ${({ theme }) => theme.colors.mutedText};

  button {
    border: 0;
    background: none;
    color: ${({ theme }) => theme.colors.brand};
    font: inherit;
    font-weight: 900;
    cursor: pointer;
  }
`;
