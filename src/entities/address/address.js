import React, {useState, useEffect} from "react";

import {Button, Container, Table, Card, Col, Row} from "react-bootstrap";
import {Trash3Fill} from "react-bootstrap-icons";

import useEntitiesService from "../entities-service";
import {CreateOrUpdateAddress} from "./address-create-or-update";
import Pageable from "../../shared/layout/pageable";
import Loading from "../../shared/layout/loading";
import {NavLink} from "react-router-dom";
import ViewArrowSort from "../../shared/layout/view-arrow-sort";
import {CreateOrUpdateBankAccount} from "../bank-account/bank-account-create-or-update";

const Address = () => {

    const [addresses, setAddress] = useState([]);

    const [pageable, setPageable] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isSort, setIsSort] = useState(true);
    const [keySort, setKeySort] = useState("id");

    const {getEntities, createEntity, deleteEntity, updateEntity, loading} = useEntitiesService();

    useEffect(() => {
        getEntities('addresses', setAddress, currentPage).then(value => {
            setPageable(value);
        });
    }, []);

    const createAddress = async (address) => {
        await createEntity('addresses', address, setAddress, currentPage);
    }

    const updateAddress = async (address, id) => {
        await updateEntity('addresses', address, setAddress, id, currentPage);
    }

    const setPage = (curPage) => {
        setCurrentPage(curPage);
        getEntities('addresses', setAddress, currentPage).then(value => {
            setPageable(value);
        });
    }

    const sort = (sortParam) => {
        let sortDirect;
        setKeySort(sortParam);
        setIsSort(!isSort);
        isSort? sortDirect = "desc" : sortDirect = "asc";
        getEntities('addresses', setAddress, currentPage, sortParam, sortDirect).then(value => {
            setPageable(value);
        });
    }

    const RenderAddress = () => {
        return(
            <Container fluid>
                <CreateOrUpdateAddress createAddress={createAddress} isNew={true}/>
                <Table striped bordered hover >
                    <thead>
                    <tr>
                        <th>Id <NavLink onClick={() => sort("id")}> <ViewArrowSort sortParam="id" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Country <NavLink onClick={() => sort("country")}> <ViewArrowSort sortParam="country" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Province <NavLink onClick={() => sort("province")}> <ViewArrowSort sortParam="province" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Postcode <NavLink onClick={() => sort("postCode")}> <ViewArrowSort sortParam="postCode" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>City <NavLink onClick={() => sort("city")}> <ViewArrowSort sortParam="city" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Street line 1 <NavLink onClick={() => sort("streetLine1")}> <ViewArrowSort sortParam="streetLine1" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Street line 2 <NavLink onClick={() => sort("streetLine2")}> <ViewArrowSort sortParam="streetLine2" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Email <NavLink onClick={() => sort("email")}> <ViewArrowSort sortParam="email" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Phone 1 <NavLink onClick={() => sort("phone1")}> <ViewArrowSort sortParam="phone1" keySort={keySort} isSort={isSort}/> </NavLink></th>
                        <th>Phone 2 <NavLink onClick={() => sort("phone2")}> <ViewArrowSort sortParam="phone2" keySort={keySort} isSort={isSort}/> </NavLink></th>
                       {/* <th>Owner </th>*/}
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {addresses.map((address, i) => (
                        <tr key={`entity-${i}`}>
                            <td>{address.id}</td>
                            <td>{address.country}</td>
                            <td>{address.province}</td>
                            <td>{address.postCode}</td>
                            <td>{address.city}</td>
                            <td>{address.streetLine1}</td>
                            <td>{address.streetLine2}</td>
                            <td>{address.email}</td>
                            <td>{address.phone1}</td>
                            <td>{address.phone2}</td>
                           {/* <td>{address.supplier? address.supplier.name : ''}
                                {address.customer? address.customer.name : ''}
                            </td>*/}
                            <td>
                                <Row>
                                    <Col style={{paddingRight: 3, paddingLeft: 10}}>
                                        <CreateOrUpdateAddress updateAddress={updateAddress} address={address} isNew={false}/>
                                    </Col>
                                    <Col style={{paddingRight: 10, paddingLeft: 3}}>
                                        <Button onClick={() => deleteEntity('addresses', address.id, setAddress, currentPage)}
                                                variant="danger"><Trash3Fill/></Button>
                                    </Col>
                                </Row>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </Table>
                <Pageable pageable={pageable} setPage={setPage}/>
            </Container>
        )
    }

    return(
        <Card style={{margin: 12}}>
            <Card.Body>
                <h2 style={{textAlign: "left"}}>Address</h2>
                {loading? <Loading/> : <RenderAddress/>}
            </Card.Body>
        </Card>
    );
}

export default Address;