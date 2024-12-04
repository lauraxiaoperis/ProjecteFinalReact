import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DigimonsList from './Home'; // Importa el componente DigimonsList
import Search from './Search';
import DigimonTeam from './DigimonTeam';
import './App.css'; // Importa los estilos

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
            <Routes>
                <Route path="/" element={<DigimonsList />} />
                <Route path="/search" element={<Search />} />
                <Route path="/digimon-team" element={<DigimonTeam />} />
            </Routes>
        </Router>
    );
}

export default App;

