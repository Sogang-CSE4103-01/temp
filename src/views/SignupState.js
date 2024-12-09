// src/views/SignupState.js
/* eslint-disable */
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'; // useHistory를 useNavigate로 변경
import debugLog from '../libs/log';
import Popup from '@enact/sandstone/Popup';
import { ADDR_ } from './address';

export const useSignupState = () => {
    const [newusername, setUsername] = useState('');
    const [newpassword, setPassword] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [popupMessage, setPopupMessage] = useState('');
    //const navigate = useNavigate(); // 페이지 이동을 위한 navigate 객체

    const handleSignupUsernameChange = useCallback((e) => {
        //const { name, value } = event.target;
        if (e && e.value !== undefined) {
            setUsername(e.value); // 사용자 이름 상태 업데이트
            console.log('sign in : name changed');
        } else {
            console.log('handle User name change Sing in erorr');
        }
    }, []);

    const handleSignupPasswordChange = useCallback((e) => {
		if (e && e.value !== undefined) {
			setPassword(e.value);
            console.log('sign in : password changed');
		} else {
			console.log('handle password change Sing in erorr');
		}
	}, []);
    
    /*
    const handlePasswordChange = useCallback((e) => {
		if (e && e.value !== undefined) {
			setPassword(e.value);
		} else {
			console.warn('handlePasswordChange: Invalid event object', e);
		}
	}, []);*/

    const handleSignup = useCallback(async () => {
        debugLog('Attempt Sign In', {newusername, newpassword}); // 디버그 로그 출력
        //navigate('/login'); // 회원가입 후 로그인 화면으로 이동 (필요에 따라 변경 가능)
        try{
            //const response = await fetch('https://cors-anywhere-herokuapp.com/https://connected-backend-yir6.onrender.com/api/register', {
            //const response = await fetch('https://connected-backend-yir6.onrender.com/api/register?username=${username}&password=${password}', {
                const response = await fetch(`${ADDR_}/api/register?username=${newusername}&password=${newpassword}`, {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                },
                //body : JSON.stringify({newusername, newpassword}),
                //credentials : 'include',
            });
            if (!response.ok) {
				throw new Error('Sign in failed');
			}
            const data = await response.json();
			debugLog('Sign In successful', data);

            //alert('Sign Up Successful!');
            setPopupMessage("Sign Up Successful!");
			//handleLoginClose();

        }catch (error){
            console.error('Sign Up Error : ', error.message);
            setPopupMessage("Sign Up failed!");
            //alert("Sign Up Failed");
        }finally{
            setIsPopupOpen(true);
        }
    

    }, [newusername, newpassword]);

    return { 
        newusername, 
        newpassword, 
        handleSignupUsernameChange, 
        handleSignupPasswordChange,
        handleSignup };
};