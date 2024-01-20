import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import PhotoListItem from './photo-item/PhotoItem';

import config from '../../config';

export default function PhotoList() {
    const [params] = useSearchParams();
    const queryString = params.toString();
    const navigate = useNavigate();
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    function nextPage() {
        setPage(page + 1);
    }

    function prevPage() {
        if (page > 1) {
            setPage(page - 1);
        }
    }

    useEffect(() => {
        fetch(
            `${config.host}/api/bg-explorer/photos?sort=-stars&page=${page}&limit=12&fields=[_id,name,image,stars,region,]&${queryString}`
        )
            .then((data) => data.json())
            .then((res) => {
                setPhotos(res.data.photos);
                setLoading(false);
            })
            .catch((err) => navigate('/404'));
    }, [params, page]);
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
            <main>
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
                <div className="arrows">
                    {page > 1 && (
                        <button onClick={prevPage}>
                            <svg>
                                <use xlinkHref="/img/icons.svg#icon-arrow-left"></use>
                            </svg>
                        </button>
                    )}

                    {photos.length === 12 && (
                        <button onClick={nextPage}>
                            <svg>
                                <use xlinkHref="/img/icons.svg#icon-arrow-right"></use>
                            </svg>
                        </button>
                    )}
                </div>
            </main>
        );
    }
}
