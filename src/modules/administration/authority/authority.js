import React, {useEffect, useState} from "react";
import useEntitiesService from "../../../services/entities-service";
import {Button, Card, Col, Container, Row, Table} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import ViewArrowSort from "../../../shared/layout/view/view-arrow-sort";
import {Trash3Fill} from "react-bootstrap-icons";
import Pageable from "../../../shared/layout/pageable";
import Loading from "../../../shared/layout/loading";

import {CreateOrUpdateAuthority} from "./authority-create-or-update";

const Authority = () => {

    const [authorities, setAuthorities] = useState([]);

    const [pageable, setPageable] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [isSort, setIsSort] = useState(true);
    const [keySort, setKeySort] = useState("id");

    const {getEntities, createEntity, deleteEntity, updateEntity, loading} = useEntitiesService();

    useEffect(() => {
        getEntities('admin/authorities', setAuthorities, currentPage).then(value => {
            setPageable(value);
        });
    }, []);

    const createAuthority = async (authority, currentPage) => {
        await createEntity('admin/authorities', authority, setAuthorities, currentPage);
    }

    const updateAuthority = async (authority, id) => {
        await updateEntity('admin/authorities', authority, setAuthorities, id, currentPage);
    }

    const setPage = (curPage) => {
        setCurrentPage(curPage);
        getEntities('admin/authorities', setAuthorities, curPage).then(value => {
            setPageable(value);
        });
    }

    const sort = (sortParam) => {
        let sortDirect;
        setKeySort(sortParam);
        setIsSort(!isSort);
        isSort? sortDirect = "desc" : sortDirect = "asc";
        getEntities('admin/authorities', setAuthorities, currentPage, "user", sortParam, sortDirect).then(value => {
            setPageable(value);
        });
    }

    const RenderAuthority = () => {
        return(
            <Container fluid>
                <CreateOrUpdateAuthority createAuthority={createAuthority} isNew={true}/>
                <Table striped bordered hover >
                    <thead>
                    <tr>
                        <th>Id
                            <NavLink onClick={() => sort("id")}>
                                <ViewArrowSort sortParam="id" keySort={keySort} isSort={isSort}/>
                            </NavLink>
                        </th>
                        <th>Name
                            <NavLink onClick={() => sort("name")}>
                                <ViewArrowSort sortParam="name" keySort={keySort} isSort={isSort}/>
                            </NavLink>
                        </th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {authorities.map((authority, i) => (
                        <tr key={`entity-${i}`}>
                            <td>{authority.id}</td>
                            <td>{authority.name}</td>
                            <td>
                                <Row>
                                    <Col style={{paddingRight: 3, paddingLeft: 15}}>
                                        <CreateOrUpdateAuthority updateAuthority={updateAuthority} isNew={false} authority={authority}/>
                                    </Col>
                                    <Col style={{paddingRight: 10, paddingLeft: 3}}>
                                        <Button
                                            onClick={() => deleteEntity('admin/authorities', authority.id, setAuthorities, currentPage)}
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
                <h2 style={{textAlign: "left"}}>Authorities</h2>
                {loading? <Loading/> : <RenderAuthority/>}
            </Card.Body>
        </Card>
    );

}

export default Authority;