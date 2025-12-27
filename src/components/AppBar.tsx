import { useState, useEffect } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { getMe, logout } from '../api/client';
import type { User } from '../types';

export const AppBar = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getMe();
        setUser(userData);

        const redirectPath = localStorage.getItem('loginRedirect');
        if (redirectPath) {
          localStorage.removeItem('loginRedirect');
          navigate(redirectPath);
        }
      } catch (error) {
        console.debug('User not authenticated', error);
      }
    };
    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      setUser(null);
      window.location.href = '/';
    }
  };

  const userIcon = (
    <span className="d-flex align-items-center gap-2">
      {user && <span className="d-none d-lg-inline">{user.name}</span>}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        fill="currentColor"
        className="bi bi-person-circle"
        viewBox="0 0 16 16"
      >
        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
        <path
          fillRule="evenodd"
          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
        />
      </svg>
    </span>
  );

  return (
    <Navbar sticky="top" bg="white">
      <Container>
        <Navbar.Brand as={Link} to="/">Open polls</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <NavDropdown title={userIcon} id="basic-nav-dropdown" align="end" className="user-dropdown-no-arrow">
              {user ? (
                 <>
                   <NavDropdown.ItemText className="fw-bold">{user.name}</NavDropdown.ItemText>
                   <NavDropdown.Divider />
                   <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                 </>
              ) : (
                <NavDropdown.Item as={Link} to="/login">Login</NavDropdown.Item>
              )}
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

