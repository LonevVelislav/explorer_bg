import { useContext, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/authContext';

export default function Logout() {
    const navigate = useNavigate();
    const { logoutHandler } = useContext(AuthContext);

    useEffect(() => {
        logoutHandler();
        navigate('/');
    }, []);

    return null;
}
