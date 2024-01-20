import { useContext, useEffect, useState, useReducer } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/authContext';
import * as photoServices from '../../services/photoService';
import * as commentsService from '../../services/commentsService';
import reducer from './commentReducer';
import likesReducer from './likesReducer';

import config from '../../config';

export default function PhotoDetails() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { userId } = useContext(AuthContext);
    const [errorMessage, setErrorsMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [photo, setPhoto] = useState({});
    const [ifLiked, setIfLiked] = useState(false);
    const [comments, commentDispatch] = useReducer(reducer, []);
    const [likes, likeDispatch] = useReducer(likesReducer, []);

    useEffect(() => {
        photoServices
            .getPhotoById(id)
            .then((res) => {
                setPhoto(res.data.photo);
                commentDispatch({
                    type: 'get-all-comments',
                    payload: res.data.photo.comments,
                });
                likeDispatch({
                    type: 'get-all-likes',
                    payload: res.data.photo.likes,
                });

                setLoading(false);
            })
            .catch((err) => {
                navigate('/404');
            });
    }, [id]);

    useEffect(() => {
        if (userId) {
            photoServices.ifLiked(id, userId).then((res) => {
                if (res.status === 'success') {
                    setIfLiked(res.data);
                }
            });
        }
    }, [likes]);

    const commentSubmitHandler = (e) => {
        e.preventDefault();
        commentsService
            .createComment(id, { text: document.getElementById('comment').value })
            .then((result) => {
                if (result.status === 'success') {
                    commentDispatch({
                        type: 'add-comment',
                        payload: result.data.comment,
                    });
                    document.getElementById('comment').value = '';
                }
                if (result.status === 'fail') {
                    setErrorsMessage(result.message);
                    setTimeout(() => {
                        setErrorsMessage('');
                    }, 3000);
                }
            });
    };

    const deleteBtnClickHandler = async () => {
        const hasConfirmed = confirm(`You sure you want to delete photo "${photo.name}"`);
        if (hasConfirmed) {
            await photoServices.removePhoto(photo._id);

            navigate('/photos');
        }
    };

    const likeBtnClickHandler = () => {
        photoServices.likePhoto(photo._id).then((result) => {
            if (result.status === 'success') {
                likeDispatch({
                    type: 'add-like',
                    payload: photo.likes,
                });
            }
        });
    };

    const delCommentBtnHandler = async (e) => {
        await commentsService.deleteComment(e.target.id);
        commentDispatch({
            type: 'delete-comment',
            payload: e.target.id,
        });
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
            <>
                <main className="main--details">
                    <section className="card__details">
                        <div className="photo-box">
                            <img
                                src={`${config.host}/photos/${photo._id}/${photo.image}`}
                                alt={photo.image}
                            />
                            <svg>
                                <use xlinkHref="/img/icons.svg#icon-map-pin"></use>
                            </svg>
                            <span>{`${photo.lat}, ${photo.lng}`}</span>
                        </div>
                        <div className="stats-box">
                            <div className="card-likes">
                                <svg>
                                    <use xlinkHref="/img/icons.svg#icon-star"></use>
                                </svg>
                                <span>{likes.length}</span>
                            </div>
                            <h1 className="card-heading__details">{photo.name}</h1>
                            <ul className="stats-list">
                                <li>
                                    <svg>
                                        <use xlinkHref="/img/icons.svg#icon-user"></use>
                                    </svg>
                                    Onwer:
                                    <span>{photo.owner?.username}</span>
                                </li>
                                <li>
                                    <svg>
                                        <use xlinkHref="/img/icons.svg#icon-radio"></use>
                                    </svg>
                                    Region: <span>{photo.region}</span>
                                </li>

                                <li>
                                    <Link to={`/photos/map/${photo._id}`} className="btn">
                                        Map
                                    </Link>
                                    <img
                                        src="/img/logo/b51a5c3039844aa0a6677738cf96e916-removebg-preview2.png"
                                        alt="logo"
                                    />
                                </li>
                                <li className="google-maps-anchor">
                                    <Link
                                        target="blank"
                                        className="btn"
                                        to={`https://www.google.com/maps/dir/${photo.lat},${photo.lng}`}
                                    >
                                        Google maps
                                    </Link>
                                    <object data="/img/icons8-google-maps.svg" type="image/svg+xml">
                                        <img src="/img/icons8-google-maps.svg" />
                                    </object>
                                </li>
                            </ul>

                            <ul className="buttons">
                                {photo.owner && userId === photo.owner?._id && (
                                    <>
                                        <li>
                                            <Link
                                                to={`/photos/${photo._id}/edit`}
                                                className="edit-btn btn"
                                            >
                                                Edit
                                            </Link>
                                            <svg>
                                                <use xlinkHref="/img/icons.svg#icon-bookmark"></use>
                                            </svg>
                                        </li>
                                        <li>
                                            <button
                                                className="delete-btn btn"
                                                onClick={deleteBtnClickHandler}
                                            >
                                                Delete
                                            </button>
                                            <svg>
                                                <use xlinkHref="/img/icons.svg#icon-delete"></use>
                                            </svg>
                                        </li>
                                    </>
                                )}
                                {userId && userId !== photo.owner?._id && (
                                    <>
                                        <li>
                                            <button
                                                className={ifLiked ? 'invalid' : 'like-btn btn'}
                                                onClick={likeBtnClickHandler}
                                            >
                                                Like
                                            </button>
                                            <svg>
                                                <use xlinkHref="/img/icons.svg#icon-star"></use>
                                            </svg>
                                        </li>
                                    </>
                                )}
                            </ul>

                            <form className="comment-form" onSubmit={commentSubmitHandler}>
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
                                <input
                                    className={userId ? 'btn' : 'invalid'}
                                    type="submit"
                                    value="comment"
                                />
                            </form>
                            {errorMessage && (
                                <div className="errors">
                                    <svg>
                                        <use xlinkHref="/img/icons.svg#icon-alert-circle"></use>
                                    </svg>
                                    <p>{errorMessage}</p>
                                </div>
                            )}
                        </div>
                    </section>
                    {/* <!-- comments section --> */}
                    <section className="comments-section">
                        {comments.length === 0 && <p className="no-comment">No comments.</p>}
                        <ul className="comments-list">
                            {comments.map(({ _id, owner, text, photo }) => {
                                return (
                                    <li key={_id} id={_id}>
                                        <div className="user-comment-avatar">
                                            <img
                                                className="user-photo"
                                                src={
                                                    photo === 'default.jpeg'
                                                        ? '/img/users_photos/default.jpeg'
                                                        : `/img/users_photos/${owner}/${photo}`
                                                }
                                                alt={`${photo}`}
                                            />
                                        </div>
                                        <span>{text}</span>
                                        {userId === owner && (
                                            <button
                                                className="comment-delete__btn"
                                                id={_id}
                                                onClick={delCommentBtnHandler}
                                            ></button>
                                        )}
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
