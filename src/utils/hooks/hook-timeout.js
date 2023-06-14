import {useContext, useState} from "react";
import {useIdleTimer} from "react-idle-timer";
import AuthContext from "../auth-context";
import {useNavigate} from "react-router-dom";

const useIdleTimeout = ({ onIdle, idleTime = 1 }) => {

    const idleTimeout = 1000 * idleTime;
    const [isIdle, setIdle] = useState(false)

    const { logOut } = useContext(AuthContext);
    const navigation = useNavigate();

    const handleIdle = () => {
        setIdle(true)
        navigation("/");
        logOut()
    }

    const idleTimer = useIdleTimer({
        timeout: idleTimeout,
        promptBeforeIdle: idleTimeout / 6,
        onPrompt: onIdle,
        onIdle: handleIdle,
        debounce: 500
    })

    return {isIdle, setIdle, idleTimer}

}

export default useIdleTimeout;