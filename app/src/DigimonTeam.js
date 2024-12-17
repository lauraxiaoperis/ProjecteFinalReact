import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DigimonCard from './DigimonCard';
import FilterBar from './FilterBar';
import './App.css';

function DigimonTeam() {
  const [digimons, setDigimons] = useState([]); // State to hold the Digimon team
  const numberDigimons = 20; // Number of Digimons to fetch per page

  /**
   * handleSearch - Fetches Digimons based on the filter values.
   * @param {Object} filters - Object containing filter parameters.
   */
  const handleSearch = (filters) => {
    const params = new URLSearchParams();
    if (filters.name) params.append('name', filters.name);
    if (filters.selectedAttribute) params.append('attribute', filters.selectedAttribute);
    if (filters.selectedLevel) params.append('level', filters.selectedLevel);
    if (filters.xAntibody) params.append('xAntibody', true);
    params.append('pageSize', numberDigimons);

    fetch(`https://digi-api.com/api/v1/digimon?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => setDigimons(data.content || []))
      .catch((error) => console.error('Error fetching Digimons:', error));
  };

  return (
    <div>
      <h2>My Digimon Team</h2>

      {/* Filter bar component */}
      <FilterBar onSearch={handleSearch} />

      <div className="digimons-container">
        {digimons.length > 0 ? (
          digimons.map((digimon) => (
            <Link key={digimon.id} to={`/digimon/${digimon.id}`}>
              <DigimonCard title={digimon.name} imageUrl={digimon.image} />
            </Link>
          ))
        ) : (
          <p>No Digimons found with the selected filters.</p>
        )}
      </div>
    </div>
  );
}

export default DigimonTeam;