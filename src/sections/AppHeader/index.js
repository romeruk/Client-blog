import React, { useContext } from 'react'
import { Navbar, Nav, Container, Button, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
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
      <Navbar className="p-3 px-md-4 mb-4 box-shadow-custom" bg="dark" variant="dark" expand="lg">
        <Container>

          <Navbar.Brand href="/">Blog</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              {user && (user.role === "ADMIN" || user.role === "SUPERADMIN") && (

                <NavDropdown title="Admin actions" id="basic-nav-dropdown">
                  <NavLink className="dropdown-item" to="/users">Users</NavLink>
                  <NavLink className="dropdown-item" to="/categories">Categories</NavLink>
                  <NavLink className="dropdown-item" to="/posts">Posts</NavLink>
                </NavDropdown>
              )}
            </Nav>
            {user ? (
              <>
                <Nav
                  activeKey="/home"
                  onSelect={(selectedKey) => alert(`selected ${selectedKey}`)}
                >
                  <Nav.Item>
                    <NavLink className="nav-link text-uppercase" to="/user/edit">Edit me</NavLink>
                  </Nav.Item>
                  <Nav.Item>
                    <NavLink className="nav-link text-uppercase" to="/user/posts">My Posts</NavLink>
                  </Nav.Item>
                  <Nav.Item>
                    <NavLink className="nav-link text-uppercase" to="/user/post/create">Create Post</NavLink>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link className="text-white" eventKey="disabled" disabled>
                      Hi {user.firstName} {user.lastName}
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <Button variant="danger" onClick={logOutAction}>Log Out</Button>
              </>
            ) :
              <Nav>

                <NavLink to="/signin" className="btn btn-outline-info mr-lg-3">Log In</NavLink>
                <NavLink to="/signup" className="btn btn-outline-info">Register</NavLink>
              </Nav>
            }

          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  )
}
