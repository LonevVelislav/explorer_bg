exports.getGeoStats = async (latitude, longitude) => {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    try {
        const res = await fetch(url);
        const data = await res.json();

        return data;
    } catch (err) {
        return err.message;
    }
};
