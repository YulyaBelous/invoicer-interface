import React, {useEffect, useState} from "react";
import useEntitiesService from "../../../services/entities-service";
import {Badge, Button, Card, Col, Container, Row, Table} from "react-bootstrap";
import {Trash3Fill} from "react-bootstrap-icons";
import Pageable from "../../../shared/components/pageable";
import Loading from "../../../shared/components/loading";
import CreateOrUpdateUsers from "./users-create-or-update";
import SortButton from "../../../shared/components/sort-button";

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
        getEntities('admin/users', setUsers, curPage).then(value => {
            setPageable(value);
        });
    }

    const sort = (sortParam) => {
        let sortDirect;
        setKeySort(sortParam);
        setIsSort(!isSort);
        isSort? sortDirect = "desc" : sortDirect = "asc";
        getEntities('admin/users', setUsers, currentPage, sortParam, sortDirect).then(value => {
            setPageable(value);
        });
    }

    const badgeClick = async (user) => {
        const newUser = {...user, activated: !user.activated}
        await updateEntity('admin/users', newUser, setUsers, newUser.id, currentPage);
    }

    const RenderUsers = () => {
        return(
            <Container fluid>
                <CreateOrUpdateUsers createUser={createUser} isNew={true}/>
                <Table striped bordered hover >
                    <thead>
                    <tr>
                        <th> Id
                            <SortButton sortParam="id" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th> First name
                            <SortButton sortParam="firstName" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th> Last name
                            <SortButton sortParam="lastName" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th> Username
                            <SortButton sortParam="username" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th> Email
                            <SortButton sortParam="email" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th> Authorities
                            <SortButton sortParam="authorities" keySort={keySort} isSort={isSort} onSort={sort} />
                        </th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map((user, i) => (
                        <tr key={`user-${i}`}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.authorities?.map((role, i) => <Badge key={i} bg="info">{role}</Badge>)}</td>
                            <td> {user.activated?
                                <Button variant="success" onClick={() => badgeClick(user)}>Activated</Button> :
                                <Button variant="secondary" onClick={() => badgeClick(user)}>Not activated</Button> }
                            </td>
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