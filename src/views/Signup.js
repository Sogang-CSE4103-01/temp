// src/views/Signup.js
import BodyText from '@enact/sandstone/BodyText';
import { Header, Panel } from '@enact/sandstone/Panels';
import { Input } from '@enact/sandstone/Input'; // Enact Input 컴포넌트
import { Button } from '@enact/sandstone/Button'; // Enact Button 컴포넌트
import { useSignupState } from './SignupState';
import css from './Signup.module.less';
import $L from '@enact/i18n/$L';

const Signup = () => {
    const { username, password, handleInputChange, handleSignup } = useSignupState(); // 상태 및 핸들러 가져오기

    return (
        <Panel>
            <Header title={$L('Register')} />
            <div className={css.signupContainer}>
                <BodyText>{$L('Register to use service.')}</BodyText>
                <Input
                    type="text"
                    name="username"
                    placeholder={$L('username')}
                    value={username}
                    onChange={handleInputChange}
                    className={css.inputField}
                />
                <Input
                    type="password"
                    name="password"
                    placeholder={$L('password')}
                    value={password}
                    onChange={handleInputChange}
                    className={css.inputField}
                />
                <Button onClick={handleSignup} className={css.signupButton}>
                    {$L('register')} 
                </Button>
            </div>
        </Panel>
    );
};  


export default Signup;