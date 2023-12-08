import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import PhotoListItem from './photo-item/PhotoItem';

export default function PhotoList() {
    const [params] = useSearchParams();
    const queryString = params.toString();
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(
            `http://localhost:3000/api/bg-explorer/photos?sort=-stars&page=1&limit=10&fields=[_id,name,image,stars,region,]&${queryString}`
        )
            .then((data) => data.json())
            .then((res) => {
                setPhotos(res.data.photos);
                setLoading(false);
            })
            .catch((err) => navigate('/404'));
    }, [params]);
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
                    <div className="no-content">
                        <h1>No photos found!</h1>
                        <svg>
                            <use xlinkHref="/img/icons.svg#icon-alert-triangle"></use>
                        </svg>
                    </div>
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
