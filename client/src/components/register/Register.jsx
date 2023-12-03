import { Link } from 'react-router-dom';
import { useContext } from 'react';

import AuthContext from '../../contexts/authContext';
import useRegisterForm from '../../hooks/useRegisterForm';

const RegisterFormKeys = {
    Username: 'username',
    Email: 'email',
    Password: 'password',
    ConfirmPassword: 'confirmPassword',
};

export default function Register() {
    const { registerHandler, errorMessage } = useContext(AuthContext);
    const { values, onChange, onSubmit } = useRegisterForm(registerHandler, {
        [RegisterFormKeys.Username]: '',
        [RegisterFormKeys.Email]: '',
        [RegisterFormKeys.Password]: '',
        [RegisterFormKeys.ConfirmPassword]: '',
    });

    return (
        <main className="main-login main">
            <form className="login-form form" onSubmit={onSubmit}>
                <div>
                    <label htmlFor="email">Username</label>
                    <input
                        type="username"
                        id="username"
                        name={RegisterFormKeys.Username}
                        onChange={onChange}
                        value={values[RegisterFormKeys.Username]}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name={[RegisterFormKeys.Email]}
                        onChange={onChange}
                        value={values[[RegisterFormKeys.Email]]}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name={[RegisterFormKeys.Password]}
                        onChange={onChange}
                        value={values[RegisterFormKeys.Password]}
                    />
                </div>
                <div>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name={[RegisterFormKeys.ConfirmPassword]}
                        onChange={onChange}
                        value={values[RegisterFormKeys.ConfirmPassword]}
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
                <input className="btn" type="submit" value="Sign up" />
                <p>
                    <span>
                        Have account?<Link to="/users/login">login</Link>
                    </span>
                </p>
            </form>
        </main>
    );
}
