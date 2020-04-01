import React, { useContext } from 'react'
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import { LoadingComponent } from '../../lib';
import { AuthContext } from '../../AuthContext/authContext';

const LOGOUT = gql`
  mutation logOut {
    logOut
  }
`;

export const AppHeader = () => {
  const { user, setUser } = useContext(AuthContext);
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
      <Navbar className="p-3 px-md-4 mb-3 bg-white border-bottom" bg="light" expand="lg">
        <Container>

          <Navbar.Brand href="/">Blog</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {user && (user.role === "ADMIN" || user.role === "SUPERADMIN") && (

                <NavDropdown title="Admin actions" id="basic-nav-dropdown">
                  <Link className="dropdown-item" to="/users">Users</Link>
                  <Link className="dropdown-item" to="/categories">Categories</Link>
                  <NavDropdown.Divider />
                  <NavDropdown.Item href="#action/3.4">Separated link</NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
            {user ? (
              <>
                <Nav as="ul" className="mr-lg-4 mb-4 mb-lg-0">
                  <li>Hi {user.firstName} {user.lastName}</li>
                </Nav>
                <Button variant="danger" onClick={logOutAction}>Log Out</Button>
              </>
            ) :
              <Nav>

                <Link to="/signin" className="btn btn-outline-primary mr-lg-3">Log In</Link>
                <Link to="/signup" className="btn btn-outline-primary">Register</Link>
              </Nav>
            }

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}
