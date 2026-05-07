import { Link } from "react-router-dom";
import styled from "styled-components";

export const AuthContainer = styled.div`
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: ${({ theme }) => theme.spacing.xl};
  background: ${({ theme }) => theme.colors.page};
`;

export const AuthCard = styled.div`
  width: 100%;
  max-width: 480px;
  padding: ${({ theme }) => theme.spacing.xl};
  border-radius: ${({ theme }) => theme.radii.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  box-shadow: ${({ theme }) => theme.shadows.lg};
`;

export const AuthTitle = styled.h1`
  margin: ${({ theme }) => theme.spacing.md} 0
    ${({ theme }) => theme.spacing.sm};

  color: ${({ theme }) => theme.colors.text};
  font-size: 2.2rem;
  line-height: 1.1;
`;

export const AuthDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSoft};
  line-height: 1.6;
`;

export const AuthStack = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xl};
`;

export const AuthFooterText = styled.p`
  margin-top: ${({ theme }) => theme.spacing.lg};
  text-align: center;
  color: ${({ theme }) => theme.colors.textSoft};
`;

export const AuthLink = styled(Link)`
  color: ${({ theme }) => theme.colors.brand};
  font-weight: 700;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;
