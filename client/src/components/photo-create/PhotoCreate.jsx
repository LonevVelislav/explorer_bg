import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import * as photoService from '../../services/photoService';

export default function PhotoCreate() {
    const navigate = useNavigate();
    const [errorMessage, setErrorsMessage] = useState('');

    const createPhotoHandler = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        const token = localStorage.getItem('token');

        formData.append('image', document.getElementById('image').files[0]);
        if (document.getElementById('coordinates').value.length === 0) {
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
            .then((res) => res.json())
            .then((data) => {
                if (data.status === 'success') {
                    navigate('/');
                }
                if (data.status === 'fail') {
                    setErrorsMessage(data.message);
                    return;
                }
            });
    };

    return (
        <main className="main-create main">
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

                {errorMessage && <p className="errors">{errorMessage}</p>}
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
