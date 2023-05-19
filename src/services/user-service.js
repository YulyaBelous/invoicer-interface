import {useHttp} from "../hooks/hook-http";

const useUserService = () => {

    const {loading, request, error, clearError} = useHttp();

    const _apiBase = "http://localhost:8080/user";

    const register = async (user) => {
       return await request(`${_apiBase}/registration`, 'post', user);

    }

    const login = async (user) => {
        const res = await request(`${_apiBase}/login`, 'post', user)
            if (res.accessToken) {
                localStorage.setItem("user", JSON.stringify(res));
            }
        return res;
    }

    const logout = () => {
        localStorage.removeItem("user");

    }

    return {register, login, logout, loading, request, error, clearError}

}

export default useUserService;