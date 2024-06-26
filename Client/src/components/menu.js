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
  return (
    <Nav>
      <NavLink href="/printall">Get Users</NavLink>
      <NavLink href="/findUserByID">findUserByID</NavLink>
      <NavLink href="/update">Update</NavLink>
    </Nav>
  );
}

export default NavBar;