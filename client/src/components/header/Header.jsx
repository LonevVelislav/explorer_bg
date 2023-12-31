import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../../contexts/authContext';

export default function Header() {
    const navigate = useNavigate();
    const { isAuth, image, username, userId } = useContext(AuthContext);

    const onSearchClickHandler = (e) => {
        e.preventDefault();

        const type = document.querySelector('.search-select').value;
        const value = document.getElementById('search-places').value;

        navigate(`/photos?${type}=${value}`);
        e.target.reset();
    };

    return (
        <header className="header">
            <nav className="main-nav-list">
                <form className="nav-search" onSubmit={onSearchClickHandler}>
                    <button className="search-button">
                        <svg>
                            <use xlinkHref="/img/icons.svg#icon-search"></use>
                        </svg>
                    </button>
                    <input
                        type="text"
                        placeholder="Search places"
                        className="nav-search-input"
                        id="search-places"
                    />
                    <h3>Search by</h3>
                    <select className="search-select">
                        <option value="name">name</option>
                        <option value="region">region</option>
                    </select>
                </form>
            </nav>
            <Link to="/" className="header-logo">
                <img
                    src="/img/logo/b51a5c3039844aa0a6677738cf96e916-removebg-preview.png"
                    alt="Explorer-logo"
                />
            </Link>

            <nav className="nav nav-user">
                <Link to="/photos" className="main-nav-link btn">
                    All photos
                </Link>
                {isAuth && (
                    <>
                        <Link to={`/users/photos/${userId}`} className="main-nav-link btn">
                            My photos
                        </Link>
                        <Link to="/photos/create" className="main-nav-link btn">
                            Create photo
                        </Link>
                        <Link to="/users/logout" className="main-nav-link btn">
                            Logout
                        </Link>
                    </>
                )}

                {!isAuth && (
                    <>
                        <Link to="/users/login" className="main-nav-link btn">
                            Log in
                        </Link>
                        <Link to="/users/register" className="main-nav-link btn">
                            Sign up
                        </Link>
                    </>
                )}
            </nav>
            {isAuth && (
                <>
                    <Link to={`/users/account/${userId}`}>
                        <img
                            className="user-photo"
                            src={
                                image !== 'default.jpeg'
                                    ? `/img/users_photos/${userId}/${image}`
                                    : `/img/users_photos/default.jpeg`
                            }
                            alt={username}
                        />
                    </Link>
                </>
            )}
        </header>
    );
}
