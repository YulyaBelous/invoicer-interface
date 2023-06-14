import {useContext, useEffect} from "react";
import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {CardList, CaretRightFill, FileTextFill, HouseDoorFill, PersonCircle, PersonFillGear} from "react-bootstrap-icons";
import {NavLink, useNavigate} from "react-router-dom";

import RegisterForm from "../../modules/accounts/register";
import LoginForm from "../../modules/accounts/login";
import AuthContext from "../../utils/auth-context";

const Header = () => {

    const {isAuth, isAdmin, isSupplier, isCustomer, logOut} = useContext(AuthContext);

    const navigation = useNavigate();

    useEffect(() => {
        if(!isAuth) {
            navigation("/");
        }
    }, [isAuth])

    const handleLogOut = () => {
        navigation("/");
        logOut();
    }

    return(
        <Navbar bg="primary" variant="dark">
            <Container fluid>
                <Navbar.Brand className="ms-4" href="#home"> <FileTextFill size={35}/> Invoice service</Navbar.Brand>
                <Nav className="me-4">
                    <Nav.Link as={NavLink} to="/"> <HouseDoorFill size={20}/> Home</Nav.Link>
                    {isAuth? <NavDropdown title={<span> <CardList size={20}/> Entities</span>} >
                        <NavDropdown.Item as={NavLink} to="/invoice"> <CaretRightFill color="royalblue"/> Invoice</NavDropdown.Item>
                        {isCustomer || isAdmin? <NavDropdown.Item as={NavLink} to="/customer"> <CaretRightFill color="royalblue"/> Customer</NavDropdown.Item> : null}
                        {isSupplier || isAdmin? <NavDropdown.Item as={NavLink} to="/supplier"> <CaretRightFill color="royalblue"/> Supplier</NavDropdown.Item> : null}
                        <NavDropdown.Item as={NavLink} to="/bank-account"> <CaretRightFill color="royalblue"/> Bank Account</NavDropdown.Item>
                        <NavDropdown.Item as={NavLink} to="/address"> <CaretRightFill color="royalblue"/> Address</NavDropdown.Item>
                    </NavDropdown> : null}
                    {isAdmin? <NavDropdown title={<span> <PersonFillGear size={20}/> Administration</span>}>
                        <NavDropdown.Item as={NavLink} to="/users"><CaretRightFill color="royalblue"/> Users</NavDropdown.Item>
                        <NavDropdown.Item as={NavLink} to="/authority"><CaretRightFill color="royalblue"/> Authority</NavDropdown.Item>
                        <NavDropdown.Item as={NavLink} to="/available-customers"><CaretRightFill color="royalblue"/> Available Customer</NavDropdown.Item>
                    </NavDropdown> : null}
                    <NavDropdown title={<span> <PersonCircle size={20}/> Account</span>} >
                        {!isAuth? <RegisterForm/> : null}
                        {!isAuth? <LoginForm/> : null}
                        {isAuth? <NavDropdown.Item onClick={handleLogOut}> <CaretRightFill color="royalblue"/> Log out</NavDropdown.Item> : null}
                    </NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Header;