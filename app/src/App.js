import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import DigimonsList from './Home'; 
import Search from './Search';
import DigimonTeam from './DigimonTeam';
import DigimonDetail from './DigimonDetail';
import { DigimonProvider } from './DigimonContext';
import './App.css'; // Import styles
import logo from './images/logo_digimon.png';
import logo_ig from './images/logo_instagram.png';
import logo_tw from './images/logo_twitter.png';
import logo_y from './images/logo_youtube.png';

function App() {
    return (
        <Router>
            {/* Header section with logo and navigation */}
            <header>
                <div id='digimon-logo'>
                    <Link to="/"><img src={logo} alt="Digimon logo"/></Link>
                </div>
                <nav>
                    <ul>
                        <li>
                            <Link to="/">COLLECTION</Link>
                        </li>
                        <li>
                            <Link to="/search">SEARCH DIGIMON</Link>
                        </li>
                        <li>
                            <Link to="/digimon-team">DIGIMON TEAM</Link>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Main content section */}
            <div className='page-content'>
                <Routes>
                    {/* Route to the collection page */}
                    <Route path="/" element={<DigimonProvider><DigimonsList /></DigimonProvider>} />

                    {/* Route to the search page */}
                    <Route path="/search" element={<DigimonProvider><Search /></DigimonProvider>} />

                    {/* Route to the Digimon team page */}
                    <Route path="/digimon-team" element={<DigimonProvider><DigimonTeam /></DigimonProvider>} />

                    {/* Route to Digimon detail page */}
                    <Route path="/digimon/:digimonId" element={<DigimonDetail />} /> 
                </Routes>
            </div>

            {/* Footer section with social media links */}
            <footer>
                <a href='https://www.instagram.com/digimonoficial?igsh=MWpmaXg3Zm0wM3V6ZQ==' target='_blank' alt="Digimon Instagram"><img src={logo_ig} alt="Digimon Instagram"></img></a>
                <a href='https://x.com/digimonworldesp?lang=ca' target='_blank' alt="Digimon Twitter"><img src={logo_tw} alt="Digimon Twitter"></img></a>
                <a href='https://www.youtube.com/@DIGIMONofficialJP' target='_blank' alt="Digimon YouTube"><img src={logo_y} alt="Digimon YouTube"></img></a>
            </footer>
        </Router>
    );
}

export default App;