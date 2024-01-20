import { createContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as authService from '../services/authSrvice';
import useAuthState from '../hooks/useAuthState';

import config from '../config';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const navigate = useNavigate();
    const [errorMessage, setErrorsMessage] = useState('');
    const [auth, setAuth] = useAuthState('auth', {});

    const loginHandler = async (values) => {
        try {
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
                    role: result.data.user.role,
                    token: result.token,
                });
                localStorage.setItem('token', result.token);
                navigate('/');
            }
        } catch (err) {
            navigate('/404');
        }
    };

    const registerHandler = async (values) => {
        try {
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
        } catch (err) {
            navigate('/404');
        }
    };

    const editAccountHandler = async (values) => {
        fetch(`${config.host}/api/bg-explorer/users/updateMe`, {
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
            })
            .catch((err) => navigate('/404'));
    };

    const resetPasswordHandler = async (values) => {
        fetch(`${config.host}/api/bg-explorer/users/upatePassword`, {
            method: 'PATCH',
            body: JSON.stringify(values),

            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
                'content-type': 'application/json',
            },
        })
            .then((data) => data.json())
            .then((res) => {
                if (res.status === 'success') {
                    logoutHandler();
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

    const deleteHandler = async () => {
        const result = await authService.removeUser();
        setAuth({});
        localStorage.removeItem('token');
        if (result.status === 'fail') {
            setErrorsMessage(res.message);
            setTimeout(() => {
                setErrorsMessage('');
            }, 3000);
        }
    };

    const values = {
        deleteHandler,
        loginHandler,
        registerHandler,
        logoutHandler,
        editAccountHandler,
        resetPasswordHandler,
        errorMessage,
        username: auth.username,
        email: auth.email,
        userId: auth._id,
        isAuth: !!auth.token,
        image: auth.image,
        role: auth.role,
    };

    return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>;
};

AuthContext.displayName = 'AuthContext';

export default AuthContext;
