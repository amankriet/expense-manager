import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/use-auth";
import styled from "styled-components";
import {
  Eyebrow,
  LogoMark,
  PrimaryButton,
} from "../components/StyledComponents";

function NotFound() {
  const navigate = useNavigate();
  const { token } = useAuth();

  return (
    <NotFoundPage>
      <NotFoundCard>
        <LogoMark>EM</LogoMark>
        <Eyebrow>404</Eyebrow>
        <h1>Page not found</h1>
        <p>The page you opened does not exist or has moved.</p>
        <PrimaryButton
          type="button"
          onClick={() => navigate(token ? "/" : "/signin", { replace: true })}
        >
          {token ? "Go to dashboard" : "Go to sign in"}
        </PrimaryButton>
      </NotFoundCard>
    </NotFoundPage>
  );
}

export default NotFound;

const NotFoundPage = styled.main`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing["3xl"]};
  background: ${({ theme }) => theme.colors.page};
`;

const NotFoundCard = styled.section`
  width: min(520px, 100%);
  display: grid;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing["5xl"]};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.surface};
  box-shadow: ${({ theme }) => theme.shadows.card};

  h1 {
    margin: 0;
    font-size: clamp(2.4rem, 7vw, 4.5rem);
    line-height: 1;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.mutedText};
    font-size: 1.05rem;
  }
`;
