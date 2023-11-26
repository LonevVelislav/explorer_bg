import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <header className="header">
            <nav className="main-nav-list">
                <form className="nav-search">
                    <button className="search-button">
                        <svg>
                            <use xlinkHref="img/icons.svg#icon-search"></use>
                        </svg>
                    </button>
                    <input type="text" placeholder="Search places" className="nav-search-input" />
                </form>
            </nav>
            <Link to="/" className="header-logo">
                <img
                    src="./img/logo/b51a5c3039844aa0a6677738cf96e916-removebg-preview.png"
                    alt="Explorer-logo"
                />
            </Link>

            <nav className="nav nav-user">
                <Link href="/photos" className="main-nav-link btn">
                    All photos
                </Link>
                <Link href="#" className="main-nav-link btn">
                    My photos
                </Link>
                <Link href="#" className="main-nav-link btn">
                    Log in
                </Link>
                <Link href="#" className="main-nav-link btn">
                    Sign in
                </Link>
            </nav>
            <Link href="#">
                <img className="user-photo" src="./img/users_photos/leo.jpg" alt="User photo" />
            </Link>
        </header>
    );
}
