import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DigimonsList from './Home'; 
import Search from './Search';
import DigimonTeam from './DigimonTeam';
import DigimonDetail from './DigimonDetail';
import { DigimonProvider } from './DigimonContext';
import './App.css'; 
import logo from './images/logo_digimon.png';
import logo_ig from './images/logo_instagram.png';
import logo_tw from './images/logo_twitter.png';
import logo_y from './images/logo_youtube.png';

function App() {
    return (
        <Router>
            <header>
                <div id='digimon-logo'>
                    <Link to="/"><img src={logo} alt="Digimon logo"/></Link>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/search">SEARCH DIGIMON</Link>
                        </li>
                        <li>
                            <Link to="/digimon-team">DIGIMON TEAM</Link>
                        </li>
                    </ul>
                </nav>
            </header>
            <div className='page-content'>
                <Routes>
                    
                    <Route path="/" element={<DigimonProvider><DigimonsList /></DigimonProvider>} />
                    <Route path="/search" element={<DigimonProvider><Search /></DigimonProvider>} />
                    <Route path="/digimon-team" element={<DigimonProvider><DigimonTeam /></DigimonProvider>} />

                    {/* Ruta al detalle del Digimon */}
                    <Route path="/digimon/:digimonId" element={<DigimonDetail />} /> 
                </Routes>
            </div>
            
            <footer>
                <a href='https://www.instagram.com/digimonoficial?igsh=MWpmaXg3Zm0wM3V6ZQ==' target='_blank' alt="Digimon Istagram"><img src={logo_ig} alt="Digimon Istagram"></img></a>
                <a href='https://x.com/digimonworldesp?lang=ca' target='_blank' alt="Digimon Twitter"><img src={logo_tw}></img></a>
                <a href='https://www.youtube.com/@DIGIMONofficialJP' target='_blank' alt="Digimon YouTube"><img src={logo_y}></img></a>
            </footer>
        </Router>
    );
}

export default App;

