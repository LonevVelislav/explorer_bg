import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as photoService from '../../services/photoService';
import config from '../../config';

export default function PhotoEdit() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [coordinates, setCoordinates] = useState('');
    const [errorMessage, setErrorsMessage] = useState('');
    const { id } = useParams();
    const [photo, setPhoto] = useState({});

    const getCurrentCoordinates = () => {
        navigator.geolocation.getCurrentPosition(successLocation, errorLocation, {
            enableHighAccuracy: true,
        });

        function successLocation(pos) {
            const currentLocation = [pos.coords.latitude, pos.coords.longitude];
            document.getElementById('coordinates').value = currentLocation.join(',');
        }
        function errorLocation() {
            const currentLocation = [23.326347032388227, 42.69641194208828];
            document.getElementById('coordinates').value = currentLocation.join(',');
        }
    };

    useEffect(() => {
        photoService.getPhotoById(id).then((result) => {
            setPhoto(result.data.photo);
            setName(result.data.photo.name);
            setCoordinates(`${result.data.photo.lat}, ${result.data.photo.lng}`);
            setLoading(false);
        });
    }, [id]);

    const editPhotoHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        const token = localStorage.getItem('token');
        if (document.getElementById('coordinates').value.length === 0) {
            setErrorsMessage('coordinates are invalid!');
            return;
        }
        const imageFile = document.getElementById('image').files.length > 0;
        if (imageFile) {
            formData.append('image', document.getElementById('image').files[0]);
        }

        formData.append('lat', Number(document.getElementById('coordinates').value.split(',')[0]));
        formData.append('lng', Number(document.getElementById('coordinates').value.split(',')[1]));
        formData.append('name', document.getElementById('name').value);

        fetch(`${config.host}/api/bg-explorer/photos/${id}`, {
            method: 'PATCH',
            body: formData,
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((data) => data.json())
            .then((res) => {
                setLoading(false);
                if (res.status === 'success') {
                    navigate(`/photos/details/${id}`);
                }
                if (res.status === 'fail') {
                    setErrorsMessage(res.message);
                    setTimeout(() => {
                        setErrorsMessage('');
                    }, 3000);
                }
            })
            .catch((err) => navigate('/404'));
    };

    const onNameChange = (e) => {
        setName(e.target.value);
    };

    const onCoordinatesChange = (e) => {
        setCoordinates(e.target.value);
    };

    if (loading) {
        return (
            <div className="loader">
                <div></div>
                <div></div>
                <div></div>
            </div>
        );
    } else {
        return (
            <main className="main-edit">
                <div className="flex-half">
                    <img
                        src={`${config.host}/photos/${photo._id}/${photo.image}`}
                        alt={photo.image}
                    />
                </div>
                <div className="flex-half">
                    <form className="form" onSubmit={editPhotoHandler}>
                        <div>
                            <label htmlFor="image">Picture</label>
                            <input type="file" id="image" name="image" />
                        </div>
                        <div>
                            <label htmlFor="name">Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={name}
                                onChange={onNameChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="coordinates">Coordinates</label>
                            <input
                                type="text"
                                id="coordinates"
                                name="coordinates"
                                value={coordinates}
                                onChange={onCoordinatesChange}
                            />
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
                            <input className="btn" type="submit" value="Edit Photo" />
                        </div>
                    </form>
                    <div>
                        <button
                            className="btn btn-current-cordinates"
                            onClick={getCurrentCoordinates}
                        >
                            <svg>
                                <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
                            </svg>
                            Use current coordinates
                        </button>
                    </div>
                </div>
            </main>
        );
    }
}
