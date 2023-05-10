import {useHttp} from "../hooks/hook-http";

const useEntitiesService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = "http://localhost:8080/api/";
    const _apiLimit = 25;

    const getEntities = async (nameEntity, setState, offset = 0, sortParam = "id", sortDirect = "asc") => {
        const res = await request(`${_apiBase}${nameEntity}?offset=${offset}&limit=${_apiLimit}&sortParam=${sortParam}&sortDirect=${sortDirect}`);
        setState(res.content);
        return res;
    }

    const createEntity = async (nameEntity, entity, setState, offset) => {
        await request(`${_apiBase}${nameEntity}`, 'post', entity);
        getEntities(nameEntity, setState, offset);
    }

    const updateEntity = async (nameEntity, entity, setState, id, offset) => {
        await request(`${_apiBase}${nameEntity}/${id}`, 'put', entity);
        getEntities(nameEntity, setState, offset);
    }

    const deleteEntity = async (nameEntity, id, setState, offset) => {
        await request(`${_apiBase}${nameEntity}/${id}`, 'delete');
        getEntities(nameEntity, setState, offset);
    }

    const reportEntity = async (nameEntity, id) => {
        const res = await request(`${_apiBase}${nameEntity}/report/${id}`, 'get');
        return res;
    }

    return {loading, getEntities, createEntity, updateEntity, deleteEntity, reportEntity, error, clearError}
}

export default useEntitiesService;