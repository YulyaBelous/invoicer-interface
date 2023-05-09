import {useCallback, useState} from "react";
import axios from "axios";

export const useHttp = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, method = 'get', body = null) => {
        setLoading(true);
        try {
            const response = await axios({method: method, url: url, data: body});
            if (response.status!==200 && response.status!==201) {
                throw new Error(`Could not fetch ${url}, status: ${response.status}`)
            }
            const data = response.data;
            setLoading(false);
            return data;
        } catch (e) {
            setLoading(false);
            setError(e.message);
            throw e;
        }
    }, [])

    const clearError = useCallback(() => setError(null), []);

    return {loading, request, error, clearError}
}