const baseUrl = 'http://localhost:3000/api/bg-explorer/photos';

export const getAllPhotos = async () => {
    const res = await fetch(
        `${baseUrl}?sort=-stars&page=1&limit=10&fields=[_id,name,image,stars,region,]`
    );

    const data = await res.json();
    return data;
};
