import React from 'react'
import {Navbar, Container, Nav, NavDropdown} from 'react-bootstrap'
import {Link} from "react-router-dom"
const Header = () => {
    return (
        <Navbar bg="primary" expand="lg" variant="dark">
            <Container>
                <Navbar.Brand>
                <Link to="/"> Herbolari </Link>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className='ml-auto'>
                        <Nav.Link href='/Camera'>Fer Foto</Nav.Link>
                        <NavDropdown title="UserID" id="basic-nav-dropdown">
                            <NavDropdown.Item href="/Gallery">El meu herbolari</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">El meu compte</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#action/3.4">Log Out</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}

export default Header
