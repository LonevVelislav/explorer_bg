// react imports
import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

//functions imports

//components imports
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import PhotoList from './components/photo-list/PhotoList';
import PhotoDetails from './components/photo-details/PhotoDetails';
import Map from './components/map/Map';

function App() {
    return (
        <>
            <Header />

            <Routes>
                <Route path="/" element={<PhotoList />} />
                <Route path="/photos" element={<PhotoList />} />
                <Route path="/photos/:id" element={<PhotoDetails />} />
                <Route path="/photos/map/:id" element={<Map />} />
            </Routes>

            <Footer />
        </>
    );
}

export default App;
