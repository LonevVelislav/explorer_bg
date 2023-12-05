import * as request from '../utils/request';

const baseUrl = 'http://localhost:3000/api/bg-explorer/comments';

export const createComment = async (photoId, data) => {
    const result = await request.post(`${baseUrl}/create/${photoId}`, data);

    return result;
};
