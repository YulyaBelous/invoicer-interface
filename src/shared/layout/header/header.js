import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {CardList, CaretRightFill, FileTextFill, HouseDoorFill, PersonFill, PersonFillGear} from "react-bootstrap-icons";

const Header = () => {

    return(
        <Navbar bg="primary" variant="dark">
            <Container fluid>
                <Navbar.Brand className="ms-4" href="#home"> <FileTextFill size={35}/> Invoice service</Navbar.Brand>
                <Nav className="me-4">
                    <Nav.Link href="#"> <HouseDoorFill size={20}/> Home</Nav.Link>
                    <NavDropdown title={<span> <CardList size={20}/> Entities</span>} >
                        <NavDropdown.Item href="/invoice"> <CaretRightFill color="royalblue"/> Invoice</NavDropdown.Item>
                        <NavDropdown.Item href="/customer"> <CaretRightFill color="royalblue"/> Customer</NavDropdown.Item>
                        <NavDropdown.Item href="/supplier"> <CaretRightFill color="royalblue"/> Supplier</NavDropdown.Item>
                        <NavDropdown.Item href="/bank-account"> <CaretRightFill color="royalblue"/> Bank Account</NavDropdown.Item>
                        <NavDropdown.Item href="/address"> <CaretRightFill color="royalblue"/> Address</NavDropdown.Item>
                    </NavDropdown>
                    <NavDropdown title={<span> <PersonFillGear size={20}/> Administration</span>}></NavDropdown>
                    <NavDropdown title={<span> <PersonFill size={20}/> Account</span>}></NavDropdown>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default Header;