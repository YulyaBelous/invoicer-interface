import {useEffect} from "react";
import {withRouter} from "./with-router";

const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

const AuthVerify = (props) => {

    let location = props.router.location;
    let navigation = props.router.navigate;

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("user"));

        if (user) {
            const decodedJwt = parseJwt(user.accessToken);
            console.log((((decodedJwt.exp * 1000 - 76269999 )) - Date.now())/1000)
            if ((decodedJwt.exp * 1000 - 76269999) < Date.now()) {
                props.logOut();
                navigation("/");
            }
        }
    }, [location]);

    return <div></div>;
}

export default withRouter(AuthVerify);