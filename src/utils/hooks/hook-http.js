import {useCallback, useState} from "react";
import axios from "axios";

import {authHeader} from "../../services/auth-header";

export const useHttp = () => {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'get', body = null) => {
        setLoading(true);
            return await axios({method: method, url: url, headers: authHeader(), data: body})
                .then(data => {
                    setLoading(false);
                    return data.data;
                })
                .catch(error => {
                    setLoading(false);
                       if(error.response.status === 401) {
                           setError("Wrong username or password!")
                           return "Wrong username or password!";
                       }
                    setError(error.response.data);
                    return error.response.data;
                })
    }, [])

    const clearError = useCallback(() => setError(null), []);

    return {loading, request, error, clearError}
}