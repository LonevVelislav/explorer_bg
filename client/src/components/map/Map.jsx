import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

import * as photoServices from '../../services/photoService';
import { renderMapBox } from '../../utils/mapbox';

export default function Map() {
    const { id } = useParams();

    const [loading, setLoading] = useState(true);
    useEffect(() => {
        photoServices.getCoordinates(id).then((res) => {
            const { name } = res.data.photo[0];
            const lat = res.data.photo[0].lat;
            const lng = res.data.photo[0].lng;
            renderMapBox(name, lng, lat);
            setLoading(false);
        });
    }, [id]);

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
            <>
                <div className="backBtn">
                    <Link className="arrow left" to={`/photos/details/${id}`}>
                        <p>Details</p>
                    </Link>
                </div>

                <main className="map-box">
                    <div className="location-stats">
                        <div>
                            Distance:<span className="distance"></span>
                        </div>
                        <div>
                            Duration:<span className="duration"></span>
                        </div>
                    </div>
                    <div id="map"></div>
                </main>
            </>
        );
    }
}
