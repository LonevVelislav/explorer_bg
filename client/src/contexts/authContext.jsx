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

    const editAccountHandler = async (values) => {
        fetch('http://localhost:3000/api/bg-explorer/users/updateMe', {
            method: 'PATCH',
            body: values,
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        })
            .then((data) => data.json())
            .then((res) => {
                if (res.status === 'success') {
                    setAuth({
                        _id: res.data.user._id,
                        username: res.data.user.username,
                        image: res.data.user.image,
                        email: res.data.user.email,
                        token: localStorage.getItem('token'),
                    });

                    navigate(`/users/account/${res.data.user._id}`);
                }
                if (res.status === 'fail') {
                    setErrorsMessage(res.message);
                    setTimeout(() => {
                        setErrorsMessage('');
                    }, 3000);
                }
            });
    };

    const logoutHandler = () => {
        setAuth({});
        localStorage.removeItem('token');
    };

    const values = {
        loginHandler,
        registerHandler,
        logoutHandler,
        editAccountHandler,
        errorMessage,
        username: auth.username,
        email: auth.email,
        userId: auth._id,
        isAuth: !!auth.token,
        image: auth.image,
    };

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

AuthContext.displayName = 'AuthContext';

export default AuthContext;
