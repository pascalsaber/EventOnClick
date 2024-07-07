// NavBar.js
import React from 'react';
import styled from 'styled-components';

const Nav = styled.nav`
  background-color: #333;
  height: 100vh;
  width: 150px;
  position: fixed;
  overflow: auto;
`;

const NavLink = styled.a`
  display: block;
  color: #f2f2f2;
  padding: 10px;
  text-decoration: none;

  &:hover {
    background-color: #ddd;
    color: black;
  }
`;

function NavBar() {
  const token = localStorage.getItem('jwt-token');
  const admin = true;
  return (
    <Nav>
      {token ?
        <>
          <NavLink href="/profile">Profile</NavLink>
          <NavLink href="/addEvent">Add Event</NavLink>
          <NavLink href="/allEvents">All Events</NavLink>
          <NavLink href="/logoff">Logoff</NavLink>
        </>
        :
        <>
          <NavLink href="/register">Register</NavLink>
          <NavLink href="/login">Login</NavLink>
        </>
      }
      {token && admin ?
        <>
          <h1>Admin</h1>
          <NavLink href="/printall">Get Users</NavLink>
          <NavLink href="/findUserByID">findUserByID</NavLink>
          <NavLink href="/update">Update</NavLink>
        </>
        : null}
    </Nav>
  );
}

export default NavBar;