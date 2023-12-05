import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import * as photoService from '../../services/photoService';

export default function PhotoEdit() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [coordinates, setCoordinates] = useState('');
    const [errorMessage, setErrorsMessage] = useState('');
    const { id } = useParams();
    const [photo, setPhoto] = useState({});

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

        fetch(`http://localhost:3000/api/bg-explorer/photos/${id}`, {
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
                    navigate(`/photos/${id}`);
                }
                if (res.status === 'fail') {
                    setErrorsMessage(res.message);
                    setTimeout(() => {
                        setErrorsMessage('');
                    }, 3000);
                }
            });
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
            <main className="main-create main">
                <div>
                    <img src={`/img/photos/${photo._id}/${photo.image}`} alt="" />
                </div>
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
}
