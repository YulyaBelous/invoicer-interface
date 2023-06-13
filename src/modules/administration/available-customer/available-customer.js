import React, {useContext, useEffect, useState} from "react";
import useEntitiesService from "../../../services/entities-service";
import AuthContext from "../../../context/auth-context";
import {Card, Col, Container, Row, Table} from "react-bootstrap";
import Pageable from "../../../shared/components/pageable";
import Loading from "../../../shared/layout/loading";
import UpdateAvailableCustomer from "./available-customer-update";
import SortButton from "../../../shared/components/sort-button";

const AvailableCustomer = () => {

    const [suppliers, setSuppliers] = useState([]);

    const [pageable, setPageable] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isSort, setIsSort] = useState(true);
    const [keySort, setKeySort] = useState("id");

    const {getEntities, updateEntity, loading} = useEntitiesService();

    const {user} = useContext(AuthContext);

    useEffect(() => {
        getEntities('suppliers', setSuppliers, currentPage, user.username).then(value => {
            setPageable(value);
        });
    }, []);

    const updateAvailableCustomer = async (supplier, id) => {

        await updateEntity('suppliers', supplier, setSuppliers, id, currentPage, user.username);
    }

    const setPage = (curPage) => {
        setCurrentPage(curPage);
        getEntities('suppliers', setSuppliers, curPage, user.username).then(value => {
            setPageable(value);
        });
    }

    const sort = (sortParam) => {
        let sortDirect;
        setKeySort(sortParam);
        setIsSort(!isSort);
        isSort? sortDirect = "desc" : sortDirect = "asc";
        getEntities('suppliers', setSuppliers, currentPage, user.username, sortParam, sortDirect).then(value => {
            setPageable(value);
        });
    }

    const RenderAvailableCustomer = () => {
        return(
            <Container fluid>
                <Table striped bordered hover >
                    <thead>
                    <tr>
                        <th>Id
                            <SortButton sortParam="id" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Supplier
                            <SortButton sortParam="fullName" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Customers</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {suppliers.map((supplier, i) => (

                        <tr key={`entity-${i}`}>
                            <td>{supplier.id}</td>
                            <td>{supplier.fullName}</td>
                            <td>{supplier.availableCustomers?.map((customer,  i) => customer)} </td>
                            <td>
                                <Row>
                                    <Col style={{paddingRight: 3, paddingLeft: 15}}>
                                        <UpdateAvailableCustomer updateAvailableCustomer={updateAvailableCustomer} supplier={supplier}/>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <Pageable pageable={pageable} setPage={setPage}/>
            </Container>
        );
    }

    return(
        <Card style={{margin: 12}}>
            <Card.Body>
                <h2 style={{textAlign: "left"}}>Available Customer</h2>
                {loading? <Loading/> : <RenderAvailableCustomer/>}
            </Card.Body>
        </Card>
    );
}

export default AvailableCustomer;