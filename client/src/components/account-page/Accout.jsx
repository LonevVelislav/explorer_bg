import { useState } from 'react';
import { useContext } from 'react';

import AuthContext from '../../contexts/authContext';
import isEmail from 'validator/lib/isEmail';
import { Link, useNavigate } from 'react-router-dom';

import config from '../../config';

export default function Account() {
    const navigate = useNavigate();
    const { username, image, userId, email, editAccountHandler, errorMessage, deleteHandler } =
        useContext(AuthContext);
    const [usernameValue, setUsernameValue] = useState(username);
    const [emailValue, setEmailValue] = useState(email);

    const submitEditHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        const imageFile = document.getElementById('image').files.length > 0;
        if (imageFile) {
            formData.append('image', document.getElementById('image').files[0]);
        }
        formData.append('username', document.getElementById('username').value);
        formData.append('email', document.getElementById('email').value);

        await editAccountHandler(formData);
    };

    const onUsernameChange = (e) => {
        setUsernameValue(e.target.value);
        e.target.value.length > 10 || e.target.value.length < 1
            ? (e.target.style.background = '#ef233c')
            : (e.target.style.background = '#28b487');
    };

    const onEmailChange = (e) => {
        setEmailValue(e.target.value);
        !isEmail(e.target.value)
            ? (e.target.style.background = '#ef233c')
            : (e.target.style.background = '#28b487');
    };

    const submitDeleteHandler = async () => {
        const hasConfirmed = confirm(`You sure you want to delete your account ${username}?`);
        if (hasConfirmed) {
            await deleteHandler();
            navigate('/');
        }
    };

    return (
        <>
            <main className="main-account">
                <form className="form" onSubmit={submitEditHandler}>
                    <img
                        className="user-photo-account"
                        src={
                            image !== 'default.jpeg'
                                ? `${config.host}/users_photos/${userId}/${image}`
                                : `${config.host}/users_photos/default.jpeg`
                        }
                        alt={username}
                    />
                    <div>
                        <label htmlFor="image">Profile picture</label>

                        <input type="file" id="image" name="image" />
                    </div>
                    <div>
                        <label htmlFor="username">{username}</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={usernameValue}
                            onChange={onUsernameChange}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={emailValue}
                            onChange={onEmailChange}
                        />
                    </div>

                    <div className="account-btns">
                        <input className="btn" type="submit" value="Edit" />

                        <Link className="btn" to={`/users/photos/${userId}`}>
                            My photos
                        </Link>
                        <Link className="btn" to={`/users/password-reset`}>
                            Password Reset
                        </Link>
                    </div>

                    {errorMessage && (
                        <div className="errors">
                            <svg>
                                <use xlinkHref="/img/icons.svg#icon-alert-circle"></use>
                            </svg>
                            <p>{errorMessage}</p>
                        </div>
                    )}
                </form>
                <div className="account-delete-btn">
                    <button className="delete-btn btn" onClick={submitDeleteHandler}>
                        Delete Account
                    </button>
                </div>
            </main>
        </>
    );
}
