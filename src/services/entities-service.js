import {useHttp} from "../hooks/hook-http";

const useEntitiesService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = "http://localhost:8080/api/";
    const _apiLimit = 25;

    const getEntities = async (nameEntity, setState, offset = 0, username = "user", sortParam = "id", sortDirect = "asc") => {
        const res = await request(`${_apiBase}${nameEntity}?offset=${offset}&limit=${_apiLimit}&sortParam=${sortParam}&sortDirect=${sortDirect}&username=${username}`);
        setState(res.content);
        return res;
    }

    const createEntity = async (nameEntity, entity, setState, offset = 0, username = "user") => {
        await request(`${_apiBase}${nameEntity}`, 'post', entity);
        getEntities(nameEntity, setState, offset, username);
    }

    const updateEntity = async (nameEntity, entity, setState, id, offset = 0, username = "user") => {
        console.log("update")
        const res = await request(`${_apiBase}${nameEntity}/${id}`, 'put', entity);
        console.log(res)
        getEntities(nameEntity, setState, offset, username);
    }

    const deleteEntity = async (nameEntity, id, setState, offset = 0, username = "user") => {
        await request(`${_apiBase}${nameEntity}/${id}`, 'delete');
        getEntities(nameEntity, setState, offset, username);
    }

    const reportEntity = async (nameEntity, id) => {
        const res = await request(`${_apiBase}${nameEntity}/report/${id}`, 'get');
        return res;
    }

    return {loading, getEntities, createEntity, updateEntity, deleteEntity, reportEntity, error, clearError}
}

export default useEntitiesService;