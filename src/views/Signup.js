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
            <Header title={$L('회원가입')} />
            <div className={css.signupContainer}>
                <BodyText>{$L('회원가입하여 서비스를 이용하세요.')}</BodyText>
                <Input
                    type="text"
                    name="username"
                    placeholder={$L('사용자 이름')}
                    value={username}
                    onChange={handleInputChange}
                    className={css.inputField}
                />
                <Input
                    type="password"
                    name="password"
                    placeholder={$L('비밀번호')}
                    value={password}
                    onChange={handleInputChange}
                    className={css.inputField}
                />
                <Button onClick={handleSignup} className={css.signupButton}>
                    {$L('회원가입')}
                </Button>
            </div>
        </Panel>
    );
};

export default Signup;