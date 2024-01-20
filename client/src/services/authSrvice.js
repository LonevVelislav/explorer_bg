import * as request from '../utils/request';
import config from '../config';

const baseUrl = `${config.host}/api/bg-explorer/users`;

export const login = async (email, password) => {
    const result = await request.post(`${baseUrl}/login`, {
        email,
        password,
    });

    return result;
};

export const register = (username, email, password, confirmPassword) =>
    request.post(`${baseUrl}/register`, {
        username,
        email,
        password,
        confirmPassword,
    });

export const removeUser = async () => {
    const result = await request.del(`${baseUrl}/deleteMe`);

    return result;
};
