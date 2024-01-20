import * as request from '../utils/request';
import config from '../config';

const baseUrl = `${config.host}/api/bg-explorer/photos`;

export const getAllPhotos = async () => {
    const result = await request.get(
        `${baseUrl}?sort=-stars&page=1&limit=10&fields=[_id,name,image,stars,region,]`
    );

    return result;
};

export const getPhotoById = async (id) => {
    const result = await request.get(`${baseUrl}/${id}/comments&owner`);

    return result;
};

export const getCoordinates = async (id) => {
    const result = await request.get(`${baseUrl}/${id}/coordinates`);

    return result;
};

export const likePhoto = async (id) => {
    const result = await request.get(`${baseUrl}/like/${id}`);

    return result;
};

export const removePhoto = async (id) => {
    const result = await request.del(`${baseUrl}/${id}`);

    return result;
};

export const ifLiked = async (id, userId) => {
    const result = await request.get(`${baseUrl}/liked/${id}?userId=${userId}`);

    return result;
};

export const getOnwerPhotos = async (id) => {
    const result = await request.get(`${baseUrl}?owner=${id}`);

    return result;
};

export const getTopPhoto = async () => {
    const result = await request.get(`${baseUrl}/get/top-photo`);

    return result;
};
