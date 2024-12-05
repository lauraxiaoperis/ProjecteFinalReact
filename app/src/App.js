import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DigimonsList from './Home'; 
import Search from './Search';
import DigimonTeam from './DigimonTeam';
import DigimonDetail from './DigimonDetail';
import { DigimonProvider } from './DigimonContext';
import './App.css'; 

function App() {
    return (
        <Router>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Home</Link>
                    </li>
                    <li>
                        <Link to="/search">Search Digimon</Link>
                    </li>
                    <li>
                        <Link to="/digimon-team">Digimon Team</Link>
                    </li>
                </ul>
            </nav>
            <div className='page-content'>
                <Routes>
                    
                    <Route path="/" element={<DigimonProvider><DigimonsList /></DigimonProvider>} />
                    <Route path="/search" element={<DigimonProvider><Search /></DigimonProvider>} />
                    <Route path="/digimon-team" element={<DigimonTeam />} />

                    {/* Ruta al detalle del Digimon */}
                    <Route path="/digimon/:digimonId" element={<DigimonDetail />} /> 
                </Routes>
            </div>
        </Router>
    );
}

export default App;

