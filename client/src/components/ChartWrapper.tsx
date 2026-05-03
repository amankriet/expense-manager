import styled from "styled-components";

const ChartWrapper = styled.div`
  background: ${({ theme }) => theme.colors.background};
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radii.md};
`;

export default ChartWrapper;
