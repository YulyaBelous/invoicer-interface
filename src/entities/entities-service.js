import {useHttp} from "../hooks/hook-http";

const useEntitiesService = () => {
    const {loading, request, error, clearError} = useHttp();

    const _apiBase = "http://localhost:8080/api/";
    const _apiLimit = 25;

    const getEntities = async (nameEntity, setState, _apiOffset = 0) => {
        const res = await request(`${_apiBase}${nameEntity}?offset=${_apiOffset}&limit=${_apiLimit}`);
        setState(res.content);
    }

    const createEntity = async (nameEntity, entity, setState) => {
        await request(`${_apiBase}${nameEntity}`, 'post', entity);
        getEntities(nameEntity, setState);
    }

    const updateEntity = async (nameEntity, entity, setState, id) => {
        await request(`${_apiBase}${nameEntity}/${id}`, 'put', entity);
        getEntities(nameEntity, setState);
    }

    const deleteEntity = async (nameEntity, id, setState) => {
        await request(`${_apiBase}${nameEntity}/${id}`, 'delete');
        getEntities(nameEntity, setState);
    }

    return {loading, getEntities, createEntity, updateEntity, deleteEntity, error, clearError}
}

export default useEntitiesService;