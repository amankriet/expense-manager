import styled from "styled-components";

export const LogoMark = styled.div`
  width: 58px;
  height: 58px;
  border-radius: ${({ theme }) => theme.radii.md};
  display: grid;
  place-items: center;
  background: ${({ theme }) => theme.colors.accent};
  color: ${({ theme }) => theme.colors.brandDark};
  font-weight: 900;
`;

export const Eyebrow = styled.span`
  display: block;
  color: ${({ theme }) => theme.colors.mutedTextStrong};
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
`;

export const PrimaryButton = styled.button`
  min-height: 46px;
  border: 0;
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.brand};
  color: ${({ theme }) => theme.colors.inverseText};
  font: inherit;
  font-weight: 800;
  cursor: pointer;

  &:disabled {
    cursor: not-allowed;
    opacity: 0.65;
  }
`;

export const FormHeader = styled.div`
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.lg};

  h1,
  h2 {
    margin: ${({ theme }) => theme.spacing.xs} 0 0;
  }
`;

export const Field = styled.label`
  display: grid;
  gap: 7px;
  color: ${({ theme }) => theme.colors.textSoft};
  font-size: 0.9rem;
  font-weight: 700;

  input,
  select,
  textarea {
    width: 100%;
    min-height: 44px;
    box-sizing: border-box;
    border: 1px solid ${({ theme }) => theme.colors.borderStrong};
    border-radius: ${({ theme }) => theme.radii.md};
    background: ${({ theme }) => theme.colors.input};
    color: ${({ theme }) => theme.colors.text};
    font: inherit;
    font-weight: 500;
    padding: 10px ${({ theme }) => theme.spacing.md};
    outline: none;
  }

  textarea {
    min-height: 86px;
    resize: vertical;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: ${({ theme }) => theme.colors.brand};
    box-shadow: ${({ theme }) => theme.shadows.focus};
  }
`;

export const InlineError = styled.p`
  margin: 0;
  padding: 10px ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  background: ${({ theme }) => theme.colors.dangerSurface};
  color: ${({ theme }) => theme.colors.danger};
  font-weight: 700;
`;

export const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: ${({ theme }) => theme.breakpoints.mobile}) {
    grid-template-columns: 1fr;
  }
`;
