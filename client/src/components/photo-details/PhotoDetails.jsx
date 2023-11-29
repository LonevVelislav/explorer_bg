import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as photoServices from '../../services/photoService';

export default function PhotoDetails() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [photo, setPhoto] = useState({});

    useEffect(() => {
        photoServices.getPhotoById(id).then((res) => {
            setPhoto(res.data.photo);
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
                <main className="main--details main">
                    <h1 className="card-heading__details">{photo.name}</h1>
                    <section className="card__details">
                        <div className="photo-box">
                            <img src={`/img/photos/${photo._id}/${photo.image}`} alt={photo.name} />
                            <svg>
                                <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
                            </svg>
                            <span>{`${photo.lat}, ${photo.lng}`}</span>
                        </div>
                        <div className="stats-box">
                            <ul className="stats-list">
                                <li>
                                    <svg>
                                        <use xlinkHref="/img/icons.svg#icon-user"></use>
                                    </svg>
                                    Onwer: <span>{photo.owner.username}</span>
                                </li>
                                <li>
                                    <svg>
                                        <use xlinkHref="/img/icons.svg#icon-radio"></use>
                                    </svg>
                                    Region: <span>{photo.region}</span>
                                </li>

                                <li>
                                    <img
                                        src="/img/logo/b51a5c3039844aa0a6677738cf96e916-removebg-preview2.png"
                                        alt="logo"
                                    />
                                    <Link to={`/photos/map/${photo._id}`} className="btn">
                                        Map
                                    </Link>
                                </li>
                                <li className="google-maps-anchor">
                                    <object data="/img/icons8-google-maps.svg" type="image/svg+xml">
                                        <img src="/img/icons8-google-maps.svg" />
                                    </object>
                                    <Link
                                        target="blank"
                                        className="btn"
                                        to={`https://www.google.com/maps/dir/${photo.lat},${photo.lng}`}
                                    >
                                        Google maps
                                    </Link>
                                </li>
                            </ul>

                            <ul className="buttons">
                                <li>
                                    <svg>
                                        <use xlinkHref="/img/icons.svg#icon-bookmark"></use>
                                    </svg>
                                    <Link to="#" className="edit-btn btn">
                                        Edit
                                    </Link>
                                </li>
                                <li>
                                    <svg>
                                        <use xlinkHref="/img/icons.svg#icon-delete"></use>
                                    </svg>
                                    <Link to="#" className="delete-btn btn">
                                        Delete
                                    </Link>
                                </li>
                                <li>
                                    <svg>
                                        <use xlinkHref="/img/icons.svg#icon-star"></use>
                                    </svg>
                                    <Link to="#" className="like-btn btn">
                                        Like
                                    </Link>
                                </li>
                            </ul>

                            <form action="#" className="comment-form">
                                <div className="user-comment-avatar">
                                    <svg>
                                        <use xlinkHref="/img/icons.svg#icon-user"></use>
                                    </svg>
                                </div>
                                <textarea
                                    className="comment-input"
                                    id="comment"
                                    name="comment"
                                    cols="30"
                                    rows="3"
                                    placeholder="Comment here"
                                ></textarea>
                                <input className="btn" type="submit" value="comment" />
                            </form>
                        </div>
                    </section>
                    {/* <!-- comments section --> */}
                    <section className="comments-section">
                        {photo.comments.length === 0 && <p className="no-comment">No comments.</p>}
                        <ul className="comments-list">
                            {photo.comments.map(({ _id, owner, text, photo }) => {
                                return (
                                    <li key={_id}>
                                        <div className="user-comment-avatar">
                                            <img
                                                className="user-photo"
                                                src={`/img/users_photos/${owner}/${photo}`}
                                                alt={`${photo}`}
                                            />
                                        </div>
                                        <span>{text}</span>
                                        <Link to="#" className="comment-delete__btn"></Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </section>
                </main>
            </>
        );
    }
}
