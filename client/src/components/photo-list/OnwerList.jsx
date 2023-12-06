import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as photoService from '../../services/photoService';

import PhotoListItem from './photo-item/PhotoItem';

export default function OwnerList() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        photoService
            .getOnwerPhotos(id)
            .then((el) => {
                setPhotos(el.data.photos);
                setLoading(false);
            })
            .catch((err) => navigate('/404'));
    }, []);
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
            <main className="main">
                {photos.length === 0 && (
                    <>
                        <p>No photos found!</p>
                    </>
                )}
                <div className="card-container">
                    {photos.map((el) => {
                        return <PhotoListItem key={el._id} {...el} />;
                    })}
                </div>
            </main>
        );
    }
}
