import React, {useEffect, useState} from "react";
import useEntitiesService from "../../services/entities-service";
import {Button, Card, Col, Container, Row, Table} from "react-bootstrap";
import CreateOrUpdateSupplier from "../supplier/supplier-create-or-update";
import {NavLink} from "react-router-dom";
import ViewArrowSort from "../../shared/layout/view/view-arrow-sort";
import {Trash3Fill} from "react-bootstrap-icons";
import Pageable from "../../shared/layout/pageable";
import Loading from "../../shared/layout/loading";
import CreateOrUpdateUsers from "./users-create-or-update";

const Users = () => {

    const [users, setUsers] = useState([]);

    const [pageable, setPageable] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isSort, setIsSort] = useState(true);
    const [keySort, setKeySort] = useState("id");

    const {getEntities, createEntity, deleteEntity, updateEntity, loading} = useEntitiesService();

    useEffect(() => {
        getEntities('admin/users', setUsers, currentPage).then(value => {
            setPageable(value);
        });
    }, []);

    const createUser = async (user, currentPage) => {
        await createEntity('admin/users', user, setUsers, currentPage);
    }

    const updateUser = async (user, id) => {
        await updateEntity('admin/users', user, setUsers, id, currentPage);
    }

    const setPage = (curPage) => {
        setCurrentPage(curPage);
        getEntities('admin/users', setUsers, currentPage).then(value => {
            setPageable(value);
        });
    }

    const sort = (sortParam) => {
        let sortDirect;
        setKeySort(sortParam);
        setIsSort(!isSort);
        isSort? sortDirect = "desc" : sortDirect = "asc";
        getEntities('admin/users', setUsers, currentPage, "user", sortParam, sortDirect).then(value => {
            setPageable(value);
        });
    }

    const RenderUsers = () => {
        return(
            <Container fluid>
                <CreateOrUpdateUsers createUser={createUser} isNew={true}/>
                <Table striped bordered hover >
                    <thead>
                    <tr>
                        <th>Id
                            <NavLink onClick={() => sort("id")}>
                                <ViewArrowSort sortParam="id" keySort={keySort} isSort={isSort}/>
                            </NavLink>
                        </th>
                        <th>First name
                            <NavLink onClick={() => sort("firstName")}>
                                <ViewArrowSort sortParam="firstName" keySort={keySort} isSort={isSort}/>
                            </NavLink>
                        </th>
                        <th>Last name
                            <NavLink onClick={() => sort("lastName")}>
                                <ViewArrowSort sortParam="lastName" keySort={keySort} isSort={isSort}/>
                            </NavLink>
                        </th>
                        <th>Username
                            <NavLink onClick={() => sort("username")}>
                                <ViewArrowSort sortParam="username" keySort={keySort} isSort={isSort}/>
                            </NavLink>
                        </th>
                        <th>Email
                            <NavLink onClick={() => sort("email")}>
                                <ViewArrowSort sortParam="email" keySort={keySort} isSort={isSort}/>
                            </NavLink>
                        </th>
                        <th>Authorities
                            <NavLink onClick={() => sort("authorities")}>
                                <ViewArrowSort sortParam="authorities" keySort={keySort} isSort={isSort}/>
                            </NavLink>
                        </th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, i) => (
                        <tr key={`entity-${i}`}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.authorities?.map((role) => role)}</td>
                            <td>
                                <Row>
                                    <Col style={{paddingRight: 3, paddingLeft: 15}}>
                                        <CreateOrUpdateUsers updateUser={updateUser} isNew={false} user={user}/>
                                    </Col>
                                    <Col style={{paddingRight: 10, paddingLeft: 3}}>
                                        <Button
                                            onClick={() => deleteEntity('admin/users', user.id, setUsers, currentPage)}
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
        );
    }

    return(
        <Card style={{margin: 12}}>
            <Card.Body>
                <h2 style={{textAlign: "left"}}>Users</h2>
                {loading? <Loading/> : <RenderUsers/>}
            </Card.Body>
        </Card>
    );

}

export default Users;