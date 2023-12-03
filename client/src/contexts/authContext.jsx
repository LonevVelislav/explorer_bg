import { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import * as authService from '../services/authSrvice';
import useAuthState from '../hooks/useAuthState';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorsMessage] = useState('');
    const [auth, setAuth] = useAuthState('auth', {});

    const loginHandler = async (values) => {
        const result = await authService.login(values.email, values.password);
        if (result.status === 'fail') {
            setErrorsMessage(result.message);
            setTimeout(() => {
                setErrorsMessage('');
            }, 3000);
        }
        if (result.status === 'success') {
            setAuth({
                _id: result.data.user._id,
                username: result.data.user.username,
                image: result.data.user.image,
                email: result.data.user.email,
                token: result.token,
            });
            localStorage.setItem('token', result.token);
            navigate('/');
        }
    };

    const registerHandler = async (values) => {
        const result = await authService.register(
            values.username,
            values.email,
            values.password,
            values.confirmPassword
        );
        if (result.status === 'fail') {
            setErrorsMessage(result.message);
            setTimeout(() => {
                setErrorsMessage('');
            }, 3000);
        }
        if (result.status === 'success') {
            setAuth({
                _id: result.data.user._id,
                username: result.data.user.username,
                image: result.data.user.image,
                email: result.data.user.email,
                token: result.token,
            });
            localStorage.setItem('token', result.token);
            navigate('/');
        }
    };

    const logoutHandler = () => {
        setAuth({});
        localStorage.removeItem('token');
    };

    const values = {
        loginHandler,
        registerHandler,
        logoutHandler,
        errorMessage,
        username: auth.username,
        email: auth.email,
        userId: auth._id,
        isAuth: !!auth.token,
    };

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

AuthContext.displayName = 'AuthContext';

export default AuthContext;
