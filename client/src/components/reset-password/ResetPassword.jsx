import { useContext, useState } from 'react';

import AuthContext from '../../contexts/authContext';

const ResetPasswordFormKeys = {
    OldPassword: 'oldPassword',
    Password: 'password',
    ConfirmPassword: 'confirmPassword',
};

export default function ResetPassword() {
    const { resetPasswordHandler, errorMessage } = useContext(AuthContext);

    const [oldPasswordValue, setOldPasswordValue] = useState('');
    const [passwordValue, setPasswordValue] = useState('');
    const [confirmPasswordValue, setConfirmPasswordValue] = useState('');

    const submitResetPasswordHandler = async (e) => {
        e.preventDefault();

        await resetPasswordHandler({
            oldPassword: oldPasswordValue,
            password: passwordValue,
            confirmPassword: confirmPasswordValue,
        });
    };

    const onOldPasswordChange = (e) => {
        setOldPasswordValue(e.target.value);
    };

    const onPasswordChange = (e) => {
        setPasswordValue(e.target.value);
        e.target.value.length < 5
            ? (e.target.style.background = '#ef233c')
            : (e.target.style.background = '#28b487');
    };

    const onConfirmPasswordChange = (e) => {
        setConfirmPasswordValue(e.target.value);
        e.target.value !== passwordValue
            ? (e.target.style.background = '#ef233c')
            : (e.target.style.background = '#28b487');
    };

    return (
        <main className="main-login main">
            <form className="login-form form" onSubmit={submitResetPasswordHandler}>
                <h1>Reset Password</h1>
                <div>
                    <label htmlFor="oldPassowrd">Old Password</label>
                    <input
                        type="password"
                        id="oldPassword"
                        name="oldPassword"
                        onChange={onOldPasswordChange}
                        value={oldPasswordValue}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        onChange={onPasswordChange}
                        value={passwordValue}
                    />
                </div>

                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        onChange={onConfirmPasswordChange}
                        value={confirmPasswordValue}
                    />
                </div>

                {errorMessage && (
                    <div className="errors">
                        <svg>
                            <use xlinkHref="/img/icons.svg#icon-alert-circle"></use>
                        </svg>
                        <p>{errorMessage}</p>
                    </div>
                )}

                <input className="btn" type="submit" value="Reset Password" />
            </form>
        </main>
    );
}
