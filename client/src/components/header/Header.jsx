import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/authContext';
import { FiAlignJustify } from 'react-icons/fi';

import config from '../../config';

export default function Header() {
    const navigate = useNavigate();
    const { isAuth, image, username, userId } = useContext(AuthContext);

    const onSearchClickHandler = (e) => {
        e.preventDefault();
        onNavClick();
        const type = document.querySelector('.search-select').value;
        const value = document.getElementById('search-places').value;

        navigate(`/photos?${type}=${value}`);
        e.target.reset();
    };

    const onNavClick = () => {
        const header = document.querySelector('.header');

        if (header.className.includes('open--header')) {
            header.classList.remove('open--header');
        }
    };

    const mobileHeaderClickHandler = () => {
        const header = document.querySelector('.header');

        if (header.className.includes('open--header')) {
            header.classList.remove('open--header');
        } else {
            header.classList.add('open--header');
        }
    };

    return (
        <>
            <button className="btn-mobile-nav" onClick={mobileHeaderClickHandler}>
                <FiAlignJustify style={{ width: '100%', height: '100%' }} />
            </button>
            <header className="header">
                <nav className="main-nav-list">
                    <form className="nav-search" onSubmit={onSearchClickHandler}>
                        <button className="search-button">
                            <svg>
                                <use xlinkHref="/img/icons.svg#icon-zoom-in"></use>
                            </svg>
                        </button>

                        <input
                            type="text"
                            placeholder="Search"
                            className="nav-search-input"
                            id="search-places"
                        />
                        <h3>Search by</h3>
                        <select className="search-select">
                            <option value="name">name</option>
                            <option value="region">region</option>
                        </select>
                    </form>

                    <Link to="/" className="header-logo">
                        <img
                            src="/img/logo/b51a5c3039844aa0a6677738cf96e916-removebg-preview.png"
                            alt="Explorer-logo"
                        />
                    </Link>

                    <Link to="/" className="btn-home main-nav-link btn" onClick={onNavClick}>
                        Home
                    </Link>

                    <Link to="/photos" className="main-nav-link btn" onClick={onNavClick}>
                        All photos
                    </Link>
                    {isAuth && (
                        <>
                            <Link
                                to={`/users/photos/${userId}`}
                                className="main-nav-link btn"
                                onClick={onNavClick}
                            >
                                My photos
                            </Link>
                            <Link
                                to="/photos/create"
                                className="main-nav-link btn"
                                onClick={onNavClick}
                            >
                                Create photo
                            </Link>
                            <Link
                                to="/users/logout"
                                className="main-nav-link btn"
                                onClick={onNavClick}
                            >
                                Logout
                            </Link>
                        </>
                    )}

                    {!isAuth && (
                        <>
                            <Link
                                to="/users/login"
                                className="main-nav-link btn"
                                onClick={onNavClick}
                            >
                                Log in
                            </Link>
                            <Link
                                to="/users/register"
                                className="main-nav-link btn"
                                onClick={onNavClick}
                            >
                                Sign up
                            </Link>
                        </>
                    )}

                    {isAuth && (
                        <>
                            <Link to={`/users/account/${userId}`} onClick={onNavClick}>
                                <img
                                    className="user-photo"
                                    src={
                                        image !== 'default.jpeg'
                                            ? `${config.host}/users_photos/${userId}/${image}`
                                            : `${config.host}/users_photos/default.jpeg`
                                    }
                                    alt={username}
                                />
                            </Link>
                        </>
                    )}
                </nav>

                {/* <nav className="nav nav-user"></nav> */}
            </header>
        </>
    );
}
