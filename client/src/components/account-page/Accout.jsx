import { useEffect, useState } from 'react';
import { useContext } from 'react';

import { Link } from 'react-router-dom';

import AuthContext from '../../contexts/authContext';
import isEmail from 'validator/lib/isEmail';

export default function Account() {
    const { username, image, userId, email, editAccountHandler, errorMessage } =
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

    return (
        <main className="main-account main">
            <form className="form" onSubmit={submitEditHandler}>
                <img
                    className="user-photo-account"
                    src={
                        image !== 'default.jpeg'
                            ? `/img/users_photos/${userId}/${image}`
                            : '/img/users_photos/default.jpeg'
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

                    <a className="btn" href="#">
                        My photos
                    </a>
                </div>

                {errorMessage && (
                    <div className="errors">
                        <svg>
                            <use xlinkHref="/img/icons.svg#icon-alert-circle"></use>
                        </svg>
                        <p>{errorMessage}</p>
                    </div>
                )}

                <div className="account-delete-btn">
                    <a className="delete-btn btn" href="#">
                        Delete Account
                    </a>
                </div>
            </form>
        </main>
    );
}
