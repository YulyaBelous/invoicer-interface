import {useEffect, useState} from "react";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {CardList, CaretRightFill, FileTextFill, HouseDoorFill, PersonFillGear} from "react-bootstrap-icons";
import {NavLink, useNavigate} from "react-router-dom";

import RegisterForm from "../../../modules/accounts/register";
import LoginForm from "../../../modules/accounts/login";
import useUserService from "../../../services/user-service";

const Header = () => {

    const [isAuthorization, setIsAuthorization] = useState(false);
    const navigation = useNavigate();

    const {logout} = useUserService();

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (user && user.accessToken) {
            setIsAuthorization(true);
        }
    }, [])

    const handleLogOut = () => {
        navigation("/")
        logout();
        setIsAuthorization(false);
    }

    const handleLogIn = (isAuthority) => {
        setIsAuthorization(isAuthority);
    }

    return(
        <Navbar bg="primary" variant="dark">
            <Container fluid>
                <Navbar.Brand className="ms-4" href="#home"> <FileTextFill size={35}/> Invoice service</Navbar.Brand>
                <Nav className="me-4">
                    <Nav.Link as={NavLink} to="/"> <HouseDoorFill size={20}/> Home</Nav.Link>
                    {isAuthorization? <NavDropdown title={<span> <CardList size={20}/> Entities</span>} >
                        <NavDropdown.Item as={NavLink} to="/invoice"> <CaretRightFill color="royalblue"/> Invoice</NavDropdown.Item>
                        <NavDropdown.Item as={NavLink} to="/customer"> <CaretRightFill color="royalblue"/> Customer</NavDropdown.Item>
                        <NavDropdown.Item as={NavLink} to="/supplier"> <CaretRightFill color="royalblue"/> Supplier</NavDropdown.Item>
                        <NavDropdown.Item as={NavLink} to="/bank-account"> <CaretRightFill color="royalblue"/> Bank Account</NavDropdown.Item>
                        <NavDropdown.Item as={NavLink} to="/address"> <CaretRightFill color="royalblue"/> Address</NavDropdown.Item>
                    </NavDropdown> : null}
                    <NavDropdown title={<span> <PersonFillGear size={20}/> Administration</span>}></NavDropdown>
                    <NavDropdown title={<span> <CardList size={20}/> Account</span>} >
                        {!isAuthorization? <RegisterForm/> : null}
                        {!isAuthorization? <LoginForm handleLogIn={handleLogIn}/> : null}
                        {isAuthorization? <NavDropdown.Item onClick={handleLogOut}> <CaretRightFill color="royalblue"/> Log out</NavDropdown.Item> : null}
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Header;