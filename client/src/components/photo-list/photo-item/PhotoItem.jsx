import { Link } from 'react-router-dom';
import config from '../../../config';

export default function PhotoListItem({ _id, image, name, region, stars }) {
    return (
        <Link to={`/photos/details/${_id}`}>
            <div className="card">
                <div className="card-likes">
                    <svg>
                        <use xlinkHref="/img/icons.svg#icon-star"></use>
                    </svg>
                    <span>{stars}</span>
                </div>
                <div className="card-header">
                    <div className="card-picture">
                        <div className="card-picture-overlay">&nbsp;</div>
                        <img
                            className="card-picture-image"
                            src={`${config.host}/photos/${_id}/${image}`}
                            alt="place 1"
                        />
                    </div>

                    <h3 className="card-heading">
                        <span>{name}</span>
                    </h3>
                </div>
                <div className="card-details">
                    <div className="card-region__details">
                        <svg>
                            <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
                        </svg>
                        <p>Region:</p>
                        <span>{region}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
