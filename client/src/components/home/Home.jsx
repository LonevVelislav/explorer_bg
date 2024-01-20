import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

import config from '../../config';

import * as photoService from '../../services/photoService';

export default function Home() {
    document.querySelector('html').classList.add('background');
    const [loading, setLoading] = useState(true);
    const [photo, setPhoto] = useState({});

    useEffect(() => {
        photoService.getTopPhoto().then((res) => {
            setPhoto(res.data.photo[0]);
            setLoading(false);
        });
    }, [photo]);

    if (loading) {
        return (
            <div className="loader">
                <div></div>
                <div></div>
                <div></div>
            </div>
        );
    } else {
        if (photo) {
            return (
                <>
                    <main className="main--home">
                        <div className="home-heading">
                            <h1 className="home-header">
                                Post and Find the best{' '}
                                <Link style={{ color: '#ffffff' }} to="/photos">
                                    photos
                                </Link>
                                &nbsp;of Bulgaria landscape!
                            </h1>
                            <Link className="btn" to={`/photos/details/${photo._id}`}>
                                photo details
                            </Link>
                        </div>
                        <div className="card-likes">
                            <h1>Top Photo today!</h1>
                            <svg>
                                <use xlinkHref="/img/icons.svg#icon-star"></use>
                            </svg>
                            <span>{photo.likes.length}</span>
                        </div>

                        <img
                            className="home-image"
                            src={`${config.host}/photos/${photo._id}/${photo.image}`}
                            alt={photo.name}
                        />
                    </main>
                </>
            );
        } else {
            <div className="no-content">
                <h1>No photos found!</h1>
                <svg>
                    <use xlinkHref="/img/icons.svg#icon-alert-triangle"></use>
                </svg>
            </div>;
        }
    }
}
