import styled from "styled-components";

interface CardProps {
  type?: "primary" | "danger";
}

const Card = styled.div<CardProps>`
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
  border: 1px solid
    ${({ theme, type }) =>
      type === "danger" ? theme.colors.danger : theme.colors.primary};
  color: ${({ theme }) => theme.colors.text};
`;

export const ExpenseCard = () => (
  <>
    <Card type="primary">Normal Expense</Card>
    <Card type="danger">Overspent Expense</Card>
  </>
);
