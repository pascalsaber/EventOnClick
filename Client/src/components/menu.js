import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';

//
function Menu() {
    const token = localStorage.getItem('jwt-token');
    const admin = true;
    return (
        <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
            <Container>
                <Navbar.Brand href="/">Event on Click</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        {token && admin ?
                            <NavDropdown title="Admin" id="basic-nav-dropdown">
                                <NavDropdown.Item href="/printall">Get Users</NavDropdown.Item>
                                <NavDropdown.Item href="/findUserByID">findUserByID</NavDropdown.Item>
                                <NavDropdown.Item href="/update">Update</NavDropdown.Item>
                            </NavDropdown> : null
                        }
                        {token ?
                            <>
                                <NavDropdown title="Event" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/addEvent">Add Event</NavDropdown.Item>
                                    <NavDropdown.Item href="/allEvents">All Events</NavDropdown.Item>
                                </NavDropdown>
                                <NavDropdown title="User" id="basic-nav-dropdown">
                                    <NavDropdown.Item href="/profile">Profile</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                    <NavDropdown.Item href="/logoff">Logoff</NavDropdown.Item>
                                </NavDropdown>
                            </>
                            :
                            <>
                                <Nav.Link href="/register">Register</Nav.Link>
                                <Nav.Link href="/login">Login</Nav.Link>
                            </>
                        }
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Menu;