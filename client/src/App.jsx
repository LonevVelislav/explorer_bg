// react imports
import { useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

//functions imports

//components imports
import Header from './components/header/Header';
import Footer from './components/footer/Footer';
import PhotoList from './components/photo-list/PhotoList';
function App() {
    return (
        <>
            <Header />

            <Routes>
                <Route path="/" element={<PhotoList />} />
                <Route path="/photos" element={<PhotoList />} />
            </Routes>

            <Footer />
        </>
    );
}

export default App;
