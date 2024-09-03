import styled from "styled-components";
import { Link } from "react-router-dom";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 50vh;
  text-align: center;
  color: #333;
`;

const Heading = styled.h1`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const SubHeading = styled.h2`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

const StyledLink = styled(Link)`
  font-size: 1rem;
  color: #007bff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const NotFound = () => {
  return (
    <Container>
      <Heading>404</Heading>
      <SubHeading>Page Not Found</SubHeading>
      <StyledLink to="/">Go Back to Home</StyledLink>
    </Container>
  );
};

export default NotFound;
