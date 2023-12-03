// react imports
import { Routes, Route } from 'react-router-dom';

//context inports
import { AuthProvider } from './contexts/authContext';

//components imports
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import PhotoList from './components/photo-list/PhotoList';
import PhotoDetails from './components/photo-details/PhotoDetails';
import Map from './components/map/Map';
import PhotoCreate from './components/photo-create/PhotoCreate';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Account from './components/account-page/Accout';
import Logout from './components/logout/Logout';

function App() {
    return (
        <AuthProvider>
            <>
                <Header />

                <Routes>
                    <Route path="/" element={<PhotoList />} />
                    <Route path="/photos" element={<PhotoList />} />
                    <Route path="/photos/:id" element={<PhotoDetails />} />
                    <Route path="/photos/map/:id" element={<Map />} />
                    <Route path="/photos/create" element={<PhotoCreate />} />
                    <Route path="/users/login" element={<Login />} />
                    <Route path="users/register" element={<Register />} />
                    <Route path="/users/account" element={<Account />} />
                    <Route path="/users/logout" element={<Logout />} />
                </Routes>

                <Footer />
            </>
        </AuthProvider>
    );
}

export default App;
