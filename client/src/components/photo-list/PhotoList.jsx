import { useEffect, useState } from 'react';
import * as photoService from '../../services/photoService';

import PhotoListItem from './photo-item/PhotoItem';

export default function PhotoList() {
    const [photos, setPhotos] = useState([]);

    useEffect(() => {
        photoService.getAllPhotos().then((el) => setPhotos(el.data.photos));
    }, []);

    return (
        <main className="main">
            <div className="card-container">
                {photos.map((el) => {
                    return <PhotoListItem key={el._id} {...el} />;
                })}
            </div>
        </main>
    );
}
