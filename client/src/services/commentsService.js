import * as request from '../utils/request';
import config from '../config';

const baseUrl = `${config.host}/api/bg-explorer/comments`;

export const createComment = async (photoId, data) => {
    const result = await request.post(`${baseUrl}/create/${photoId}`, data);

    return result;
};

export const deleteComment = async (id) => {
    const result = await request.del(`${baseUrl}/${id}`);

    return result;
};
