import styled from "styled-components";

export const LogoMark = styled.div`
  width: 58px;
  height: 58px;
  border-radius: 8px;
  display: grid;
  place-items: center;
  background: #d5f365;
  color: #1f2d27;
  font-weight: 900;
`;

export const Eyebrow = styled.span`
  display: block;
  color: #637063;
  font-size: 0.74rem;
  font-weight: 800;
  letter-spacing: 0;
  text-transform: uppercase;
`;

export const PrimaryButton = styled.button`
  min-height: 46px;
  border: 0;
  border-radius: 8px;
  background: #26362f;
  color: #fffdf8;
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
  gap: 16px;

  h1,
  h2 {
    margin: 4px 0 0;
  }
`;

export const Field = styled.label`
  display: grid;
  gap: 7px;
  color: #4c574f;
  font-size: 0.9rem;
  font-weight: 700;

  input,
  select,
  textarea {
    width: 100%;
    min-height: 44px;
    box-sizing: border-box;
    border: 1px solid #d7d0c1;
    border-radius: 8px;
    background: #fff;
    color: #202721;
    font: inherit;
    font-weight: 500;
    padding: 10px 12px;
    outline: none;
  }

  textarea {
    min-height: 86px;
    resize: vertical;
  }

  input:focus,
  select:focus,
  textarea:focus {
    border-color: #26362f;
    box-shadow: 0 0 0 3px rgba(38, 54, 47, 0.12);
  }
`;

export const InlineError = styled.p`
  margin: 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: #fff1ee;
  color: #9a2d26;
  font-weight: 700;
`;

export const TwoColumn = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 560px) {
    grid-template-columns: 1fr;
  }
`;
