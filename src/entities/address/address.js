import React, {useState, useEffect, useContext} from "react";

import {Button, Container, Table, Card, Col, Row} from "react-bootstrap";
import {Trash3Fill} from "react-bootstrap-icons";

import useEntitiesService from "../../services/entities-service";
import {CreateOrUpdateAddress} from "./address-create-or-update";
import Pageable from "../../shared/components/pageable";
import Loading from "../../shared/components/loading";
import SortButton from "../../shared/components/sort-button";
import AuthContext from "../../utils/auth-context";

const Address = () => {

    const [addresses, setAddress] = useState([]);

    const [pageable, setPageable] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isSort, setIsSort] = useState(true);
    const [keySort, setKeySort] = useState("id");

    const {getEntities, createEntity, deleteEntity, updateEntity, loading} = useEntitiesService();

    const {user} = useContext(AuthContext);

    useEffect(() => {
        getEntities('addresses', setAddress, currentPage, user.username).then(value => {
            setPageable(value);
        });
    }, []);

    const createAddress = async (address) => {
        await createEntity('addresses', address, setAddress, currentPage, user.username);
    }

    const updateAddress = async (address, id) => {
        await updateEntity('addresses', address, setAddress, id, currentPage, user.username);
    }

    const setPage = (curPage) => {
        setCurrentPage(curPage);
        getEntities('addresses', setAddress, curPage, user.username).then(value => {
            setPageable(value);
        });
    }

    const sort = (sortParam) => {
        let sortDirect;
        setKeySort(sortParam);
        setIsSort(!isSort);
        isSort? sortDirect = "desc" : sortDirect = "asc";
        getEntities('addresses', setAddress, currentPage, user.username, sortParam, sortDirect).then(value => {
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
                        <th>Id
                            <SortButton sortParam="id" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Country
                            <SortButton sortParam="country" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Province
                            <SortButton sortParam="province" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Postcode
                            <SortButton sortParam="postCode" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>City
                            <SortButton sortParam="city" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Street line 1
                            <SortButton sortParam="streetLine1" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Street line 2
                            <SortButton sortParam="streetLine2" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Email
                            <SortButton sortParam="email" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Phone 1
                            <SortButton sortParam="phone1" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Phone 2
                            <SortButton sortParam="phone2" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
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
                            <td>
                                <Row>
                                    <Col style={{paddingRight: 3, paddingLeft: 10}}>
                                        <CreateOrUpdateAddress updateAddress={updateAddress} address={address} isNew={false}/>
                                    </Col>
                                    <Col style={{paddingRight: 10, paddingLeft: 3}}>
                                        <Button onClick={() => deleteEntity('addresses', address.id, setAddress, currentPage, user.username)}
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