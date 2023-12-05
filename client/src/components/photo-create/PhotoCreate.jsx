import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as photoService from '../../services/photoService';

export default function PhotoCreate() {
    const navigate = useNavigate();
    const [errorMessage, setErrorsMessage] = useState('');
    const [loading, setLoading] = useState(false);

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

        fetch('http://localhost:3000/api/bg-explorer/photos', {
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
                    navigate('/');
                }
                if (res.status === 'fail') {
                    setErrorsMessage(res.message);
                    setTimeout(() => {
                        setErrorsMessage('');
                    }, 2500);
                }
            });
    };

    return (
        <main className="main-create main">
            {loading && (
                <div className="loader">
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            )}
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
                    <button className="btn btn-current-cordinates">
                        <svg>
                            <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
                        </svg>
                        Use current coordinates
                    </button>
                </div>
            </form>
        </main>
    );
}
