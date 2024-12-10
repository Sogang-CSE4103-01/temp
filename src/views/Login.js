/* eslint-disable */
import BodyText from '@enact/sandstone/BodyText';
import {Header, Panel} from '@enact/sandstone/Panels';
import $L from '@enact/i18n/$L';
import Button from '@enact/sandstone/Button';
import Input from '@enact/sandstone/Input';
import css from './Login.module.less';

import css2 from './Signup.module.less';
import TabLayout, {Tab} from '@enact/sandstone/TabLayout';

import { useSignupState } from './SignupState';
import { useLogin } from './LoginState';
import useLogOut from './LogoutState';

const Login = ({ onSubmit, onClose }) => {
    const {
        newusername,
        newpassword,
        handleSignupUsernameChange,
        handleSignupPasswordChange,
        handleSignup,
    } = useSignupState();

    const {
        isLoginOpen,
        loginMessage, // 로그인 메시지 추가
        handleLoginOpen,
        handleLoginClose,
        handleLogin,
        handleCancel,
        handleUsernameChange,
        handlePasswordChange,
        username,
        password,
    } = useLogin();

    const {
        isLoggedOut,
        setUsername,
        setPassword,
        handleLogOut,
    } = useLogOut();
    
    return (
        <Panel
            style={{
                backgroundImage: 'linear-gradient(to bottom, #00006a, #000000)', // 어두운 파랑(#00008b)에서 검정(#000000)으로 그라데이션
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                height: '100%', 
            }}
        
        >
            <Header title={$L('Log In and Sign Up')} />
            <TabLayout>
                {/* Log In Tab */}
                <Tab title={$L('Log In')}>
                    <div className={css.loginContainer}>
                        <BodyText className={css.title}>Login</BodyText>
                        <Input
                            placeholder="Username"
                            value={username}
                            onChange={handleUsernameChange}
                            type="text"
                            className={css.input}
                        />
                        <Input
                            placeholder="Password"
                            value={password}
                            onChange={handlePasswordChange}
                            type="password"
                            className={css.input}
                        />
                        <Button onClick={handleLogin} size="small" className={css.button}>
                            Login
                        </Button>
                        <Button onClick={handleCancel} size="small" className={css.button}>
                            Cancel
                        </Button>
                        {/* 로그인 메시지 표시 */}
                        {loginMessage && <BodyText className={css.loginMessage}>{loginMessage}</BodyText>}
                    </div>
                </Tab>

                {/* Sign Up Tab */}
                <Tab title={$L('Sign Up')}>
                    <div className={css2.signupContainer}>
                        <BodyText>{$L('Sign Up to use the service.')}</BodyText>
                        <Input
                            type="text"
                            name="username"
                            placeholder={$L('Username')}
                            value={newusername}
                            onChange={handleSignupUsernameChange}
                            className={css2.inputField}
                        />
                        <Input
                            type="password"
                            name="password"
                            placeholder={$L('Password')}
                            value={newpassword}
                            onChange={handleSignupPasswordChange}
                            className={css2.inputField}
                        />
                        
                        <Button onClick={handleSignup} size="small" className={css.button}>
                            {$L('register')}
                        </Button>
                    </div>
                </Tab>

                {/* Log Out Tab */}
                <Tab title={$L('Log Out')}>
                    <div className={css.logoutContainer}>
                        <BodyText className={css.title}>{$L('Click the Log Out button if you want to quit')}</BodyText>
                        <Button onClick={handleLogOut} className={css2.logoutButton}>
                            Log Out
                        </Button>
                    </div>
                </Tab>
            </TabLayout>
        </Panel>
    );
};

export default Login;
