import React from 'react'
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { LoadingComponent } from '../../lib';

const LOGOUT = gql`
  mutation logOut {
    logOut
  }
`;

export const AppHeader = ({ user, setUser }) => {
  const [logOut, { loading }] = useMutation(LOGOUT, {
    onCompleted: () => {
      setUser(null);
    }
  });

  const logOutAction = async () => {
    await logOut();
  }

  if (loading) return <LoadingComponent />

  return (
    <>
      <Navbar bg="light" expand="lg">
        <Container>

          <Navbar.Brand href="#home">React-Bootstrap</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#link">Link</Nav.Link>
            </Nav>
            {user ? (
              <Nav>
                <p>Hi {user.firstName} {user.lastName}</p>
                <Button onClick={logOutAction}>Log Out</Button>
              </Nav>
            ) :
              <Nav>
                <Link to="/signin" className="btn btn-primary mr-lg-3">Log In</Link>
                <Link to="/signup" className="btn btn-primary">Register</Link>
              </Nav>
            }

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}
