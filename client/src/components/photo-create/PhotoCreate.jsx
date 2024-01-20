import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import config from '../../config';

export default function PhotoCreate() {
    const navigate = useNavigate();
    const [errorMessage, setErrorsMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const getCurrentCoordinates = () => {
        setLoading(true);
        navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
            enableHighAccuracy: true,
        });

        function successLocation(pos) {
            const currentLocation = [pos.coords.latitude, pos.coords.longitude];
            document.getElementById('coordinates').value = currentLocation.join(',');
            setLoading(false);
        }
        function errorLocation() {
            const currentLocation = [23.326347032388227, 42.69641194208828];
            document.getElementById('coordinates').value = currentLocation.join(',');
            setLoading(false);
        }
    };

    const createPhotoHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        const token = localStorage.getItem('token');

        formData.append('image', document.getElementById('image').files[0]);
        if (document.getElementById('coordinates').value.length === 0) {
            setTimeout(() => {
                setErrorsMessage('');
            }, 3000);
            setErrorsMessage('coordinates are invalid!');
            return;
        }
        formData.append('lat', Number(document.getElementById('coordinates').value.split(',')[0]));
        formData.append('lng', Number(document.getElementById('coordinates').value.split(',')[1]));
        formData.append('name', document.getElementById('name').value);

        fetch(`${config.host}/api/bg-explorer/photos`, {
            method: 'POST',
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((data) => data.json())
            .then((res) => {
                setLoading(false);
                if (res.status === 'success') {
                    navigate('/photos');
                }
                if (res.status === 'fail') {
                    setErrorsMessage(res.message);
                    setTimeout(() => {
                        setErrorsMessage('');
                    }, 2500);
                }
            })
            .catch((err) => navigate('/404'));
    };

    return (
        <main className="main-create">
            {loading && (
                <div className="loader">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            )}
            <div>
                <button className="btn btn-current-cordinates" onClick={getCurrentCoordinates}>
                    <svg>
                        <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
                    </svg>
                    Use current coordinates
                </button>
            </div>

            <form className="form" onSubmit={createPhotoHandler}>
                <div>
                    <label htmlFor="image">Picture</label>
                    <input type="file" id="image" name="image" />
                </div>
                <div>
                    <label htmlFor="name">Name</label>
                    <input type="text" id="name" name="name" />
                </div>
                <div>
                    <label htmlFor="coordinates">Coordinates</label>
                    <input type="text" id="coordinates" name="coordinates" />
                </div>

                {errorMessage && (
                    <div className="errors">
                        <svg>
                            <use xlinkHref="/img/icons.svg#icon-alert-circle"></use>
                        </svg>
                        <p>{errorMessage}</p>
                    </div>
                )}
                <div>
                    <input className="btn" type="submit" value="Create Photo" />
                </div>
            </form>
        </main>
    );
}
