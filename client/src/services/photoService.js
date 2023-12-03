import * as request from '../utils/request';

const baseUrl = 'http://localhost:3000/api/bg-explorer/photos';

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

export const create = async (photoData) => {
    const result = await request.post(baseUrl, photoData);

    return result;
};
