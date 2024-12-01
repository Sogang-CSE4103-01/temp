// src/views/LoginState.js
/* eslint-disable */
import { useState, useCallback, useContext } from 'react';
import debugLog from '../libs/log';
import {PanelContext} from './Context';

export const useLogin = () => {
	const [isLoginOpen, setLoginOpen] = useState(true); // 초기값을 true로 설정
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoginSuccess, setLoginSuccess] = useState(false);
    const {setPanelData} = useContext(PanelContext);

	const handleLoginOpen = useCallback(() => {
		setLoginOpen(true);
	}, []);

	const handleLoginClose = useCallback(() => {
		setLoginOpen(false);
		setLoginSuccess(true);
		//setUsername('');
		//setPassword('');
	}, [isLoginSuccess]);

	const handleUsernameChange = useCallback((e) => {
		if (e && e.value !== undefined) {
			setUsername(e.value);
			console.log('log in : name submitted');
		} else {
			console.warn('handleUsernameChange: Invalid event object', e);
		}
	}, []);

	const handlePasswordChange = useCallback((e) => {
		if (e && e.value !== undefined) {
			setPassword(e.value);
			console.log('log in : PW submitted');
		} else {
			console.warn('handlePasswordChange: Invalid event object', e);
		}
	}, []);

	const handleCancel = useCallback(() => {
		//setLoginOpen(false);
		setUsername('');
		setPassword('');
        setPanelData([{name : 'main', data:{}}]);
	},);

	const handleLogin = useCallback(async () => {
		debugLog('Attempting login', { username, password });
		try {
			//const response = await fetch(`https://cors-anywhere-herokuapp.com/https://connected-backend-yir6.onrender.com/api/login`, {
			//const response = await fetch('https://connected-backend-yir6.onrender.com/api/login?username=${username}&password=${password}', {
			const response = await fetch(`/api/login?username=${username}&password=${password}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				//body : JSON.stringify({username, password}),
				//credentials: 'include',
			});
			if (!response.ok) {
				//throw new Error('Login failed');
				const data = await response.json();
				debugLog('Login 111', data);
				setLoginSuccess(true);
				handleLoginClose();
			}
			const data = await response.json();
			debugLog('Login successful', data);
			setLoginSuccess(true);
			handleLoginClose();
		} catch (error) {
			//const data = await response.json();
			debugLog('Login failed 222', error.message);
			//debugLog('Login 111', data);
			setLoginSuccess(true);
			//isLoginSuccess = true;
			console.log(isLoginSuccess);
			handleLoginClose();
            setPanelData([{name : 'main', data:{}}]);
		}
	}, [username, password, isLoginSuccess, handleLoginClose]);

	return {
		isLoginOpen,
		isLoginSuccess,
		handleLoginOpen,
		handleLoginClose,
		handleLogin,
		handleUsernameChange,
		handlePasswordChange,
		handleCancel,
		username,
		password
	};
};