import {useHttp} from "../utils/hooks/hook-http";
import {useContext} from "react";
import AuthContext from "../utils/auth-context";

const useEntitiesService = () => {

    const {loading, request, error, clearError} = useHttp();
    const {user} = useContext(AuthContext);

    const username = user.username;

    const _apiBase = "http://localhost:8080/api/";

    const getEntities = async (nameEntity, setState, offset = 0, sortParam = "id", sortDirect = "asc") => {
        const res = await request(`${_apiBase}${nameEntity}?offset=${offset}&sortParam=${sortParam}&sortDirect=${sortDirect}&username=${username}`);
        setState(res.content);
        return res;
    }

    const createEntity = async (nameEntity, entity, setState, offset = 0) => {
        await request(`${_apiBase}${nameEntity}`, 'post', entity);
        getEntities(nameEntity, setState, offset);
    }

    const updateEntity = async (nameEntity, entity, setState, id, offset = 0) => {
        await request(`${_apiBase}${nameEntity}/${id}`, 'put', entity);
        getEntities(nameEntity, setState, offset);
    }

    const deleteEntity = async (nameEntity, id, setState, offset = 0) => {
        await request(`${_apiBase}${nameEntity}/${id}`, 'delete');
        getEntities(nameEntity, setState, offset);
    }

    const reportEntity = async (nameEntity, id) => {
        return await request(`${_apiBase}${nameEntity}/report/${id}`, 'get');
    }

    return {loading, getEntities, createEntity, updateEntity, deleteEntity, reportEntity, error, clearError}
}

export default useEntitiesService;