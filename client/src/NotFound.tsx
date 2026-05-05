import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/use-auth";
import styled from "styled-components";
import { Eyebrow, LogoMark, PrimaryButton } from "./components/StyledHtmlTags";

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
  padding: 24px;
  background: #f6f3ee;
`;

const NotFoundCard = styled.section`
  width: min(520px, 100%);
  display: grid;
  gap: 18px;
  padding: 34px;
  border: 1px solid #e4ded2;
  border-radius: 8px;
  background: #fffdf8;
  box-shadow: 0 24px 80px rgba(45, 38, 25, 0.12);

  h1 {
    margin: 0;
    font-size: clamp(2.4rem, 7vw, 4.5rem);
    line-height: 1;
  }

  p {
    margin: 0;
    color: #657169;
    font-size: 1.05rem;
  }
`;
