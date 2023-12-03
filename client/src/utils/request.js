const options = (data) => {
    const options = {};
    if (data) {
        options.body = JSON.stringify(data);
        options.headers = {
            'content-type': 'application/json',
        };
    }
    const token = localStorage.getItem('token');
    if (token) {
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${token}`,
        };
    }

    return options;
};

export const request = async (method, url, data) => {
    const response = await fetch(url, { method, ...options(data) });
    if (response.status === 204) {
        return {};
    }
    const result = await response.json();

    return result;
};

export const get = request.bind(null, 'GET');
export const post = request.bind(null, 'POST');
export const del = request.bind(null, 'DELETE');
export const patch = request.bind(null, 'PATCH');
