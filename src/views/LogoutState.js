import { useState, useCallback, useContext } from 'react';
import debugLog from '../libs/log';
import {PanelContext} from './Context';

export const useLogOut = () => {
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

    const handleLogOut = useCallback(() => {
        setIsLoggedOut(true);

        console.log("logout requested");
        console.log(username, password);

        setUsername('');
        setPassword('');

        window.location.href = '/login';
	}, []);

    return {
        isLoggedOut,
        username,
        password,
        setUsername,
        setPassword,
        handleLogOut
    }
}

export default useLogOut;