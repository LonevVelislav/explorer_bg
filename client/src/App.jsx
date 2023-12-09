// react imports
import { Routes, Route } from 'react-router-dom';

//context inports
import { AuthProvider } from './contexts/authContext';

//components imports
import Header from './components/header/Header';
import Home from './components/home/Home';
import Footer from './components/footer/Footer';
import PhotoList from './components/photo-list/PhotoList';
import PhotoDetails from './components/photo-details/PhotoDetails';
import Map from './components/map/Map';
import PhotoCreate from './components/photo-create/PhotoCreate';
import Login from './components/login/Login';
import Register from './components/register/Register';
import Account from './components/account-page/Accout';
import Logout from './components/logout/Logout';
import PhotoEdit from './components/photo-edit/PhotoEdit';
import OwnerList from './components/photo-list/OnwerList';

import CastError from './components/404/404';
import AuthGuard from './components/guards/AuthGuard';
import ResetPassword from './components/reset-password/ResetPassword';

function App() {
    return (
        <AuthProvider>
            <>
                <Header />

                <Routes>
                    <Route path="*" element={<CastError />} />
                    <Route path="/" element={<Home />} />
                    <Route path="/photos" element={<PhotoList />} />
                    <Route path="/photos/details/:id" element={<PhotoDetails />} />
                    <Route path="/photos/map/:id" element={<Map />} />
                    <Route path="/users/login" element={<Login />} />
                    <Route path="/users/register" element={<Register />} />

                    <Route element={<AuthGuard />}>
                        <Route path="/photos/create" element={<PhotoCreate />} />
                        <Route path="/photos/:id/edit" element={<PhotoEdit />} />
                        <Route path="/users/account/:id" element={<Account />} />
                        <Route path="/users/password-reset" element={<ResetPassword />} />
                        <Route path="/users/logout" element={<Logout />} />
                        <Route path="/users/photos/:id" element={<OwnerList />} />
                    </Route>
                </Routes>

                <Footer />
            </>
        </AuthProvider>
    );
}

export default App;
