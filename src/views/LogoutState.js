/* eslint-disable */
import { useState, useCallback, useContext } from 'react';
import debugLog from '../libs/log';
import {PanelContext} from './Context';

export const useLogOut = () => {
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
    const { setPanelData } = useContext(PanelContext);
    
    const handleLogOut = useCallback(() => {
        setIsLoggedOut(true);

        console.log("logout requested");
        console.log(username, password);

        setUsername('');
        setPassword('');

        setPanelData([{ name: 'login', data: {} }]);
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