/* eslint-disable */
import { useState, useCallback, useContext } from 'react';
import debugLog from '../libs/log';
import { PanelContext } from './Context';

export const useLogin = () => {
	const [isLoginOpen, setLoginOpen] = useState(true);
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoginSuccess, setLoginSuccess] = useState(false);
	const [loginMessage, setLoginMessage] = useState(''); // 로그인 메시지 상태 추가
    const { setPanelData } = useContext(PanelContext);

	const handleLoginOpen = useCallback(() => {
		setLoginOpen(true);
		setLoginMessage(''); // 메시지 초기화
	}, []);

	const handleLoginClose = useCallback(() => {
		setLoginOpen(false);
	}, []);

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
		setUsername('');
		setPassword('');
		setLoginMessage(''); // 메시지 초기화
        setPanelData([{ name: 'main', data: {} }]);
	}, []);

	const handleLogin = useCallback(async () => {
		debugLog('Attempting login', { username, password });
		try {
			const response = await fetch(`http://192.168.0.2:8080/api/login?username=${username}&password=${password}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
			});
			if (!response.ok) {
				const data = await response.json();
				debugLog('Login failed', data);
				setLoginMessage('Login failed: Invalid username or password'); // 실패 메시지 설정
				setLoginSuccess(false);
				return;
			}
			const data = await response.json();
			debugLog('Login successful', data);
			setLoginMessage('Login successful!'); // 성공 메시지 설정
			setLoginSuccess(true);
			handleLoginClose();
			setPanelData([{ name: 'main', data: {} }]);
		} catch (error) {
			debugLog('Login failed', error.message);
			setLoginMessage('Login failed: Network error'); // 실패 메시지 설정
			setLoginSuccess(false);
		}
	}, [username, password, handleLoginClose, setPanelData]);

	return {
		isLoginOpen,
		isLoginSuccess,
		loginMessage, // 메시지를 반환값에 포함
		handleLoginOpen,
		handleLoginClose,
		handleLogin,
		handleUsernameChange,
		handlePasswordChange,
		handleCancel,
		username,
		password,
	};
};
