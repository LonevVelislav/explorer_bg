import { useContext } from 'react';
import useLoginForm from '../../hooks/useLoginForm';
import AuthContext from '../../contexts/authContext';
import { Link } from 'react-router-dom';

const LoginFormKeys = {
    Email: 'email',
    Password: 'password',
};

export default function Login() {
    const { loginHandler, errorMessage } = useContext(AuthContext);
    const { values, onChange, onSubmit } = useLoginForm(loginHandler, {
        [LoginFormKeys.Email]: '',
        [LoginFormKeys.Password]: '',
    });

    return (
        <main className="main-login main">
            <form className="login-form form" onSubmit={onSubmit}>
                <div>
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        name={LoginFormKeys.Email}
                        onChange={onChange}
                        value={values[LoginFormKeys.Email]}
                    />
                </div>
                <div>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name={LoginFormKeys.Password}
                        onChange={onChange}
                        value={values[LoginFormKeys.Password]}
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
                <input className="btn" type="submit" value="login" />
                <p>
                    <span>
                        Sign up <Link to="/users/register">here</Link>
                    </span>
                </p>
            </form>
        </main>
    );
}
