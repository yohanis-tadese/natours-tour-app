import styled from "styled-components";

const ErrorMessage = styled.p`
  color: #e74c3c; /* Red color for error */
  font-size: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  margin: 1rem;
`;

const ErrorIcon = styled.span`
  font-size: 1.5rem;
  margin-right: 0.5rem;
`;

export default function Error() {
  return (
    <ErrorMessage>
      <ErrorIcon>💥</ErrorIcon>
      There was an error fetching data
      <ErrorIcon> 💥</ErrorIcon>
    </ErrorMessage>
  );
}
