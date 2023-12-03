export default function Account() {
    return (
        <main className="main-account main">
            <form action="#" className="form">
                <div>
                    <label htmlFor="image">Profile picture</label>
                    <input type="file" id="image" name="image" accept="image/jpeg" />
                </div>
                <div>
                    <label htmlFor="username">Username</label>
                    <input type="text" id="username" name="username" value="Velsilav" />
                </div>
                <div>
                    <label htmlFor="email">Email</label>
                    <input type="email" id="email" name="email" value="vili@abv.bg" />
                </div>
                <div className="account-btns">
                    <a className="btn" href="#">
                        Edit
                    </a>
                    <a className="btn" href="#">
                        My photos
                    </a>
                </div>

                <div className="account-delete-btn">
                    <a className="delete-btn btn" href="#">
                        Delete Account
                    </a>
                </div>
            </form>
        </main>
    );
}
