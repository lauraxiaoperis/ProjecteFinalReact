import React, { useState, useEffect } from 'react';  
import { Link } from 'react-router-dom';  
import DigimonCard from './DigimonCard';  
import FilterBar from './FilterBar';  
import eggImage from './images/digimon_egg.jpg';  
import './App.css';  
import './Team.css';

function DigimonTeam() {
  // State variables
  const [digimons, setDigimons] = useState([]); // List of Digimons fetched from API
  const [team, setTeam] = useState(Array(6).fill(null)); // The team of 6 Digimons (empty initially)
  const [savedTeams, setSavedTeams] = useState({}); // Object holding saved teams
  const [teamName, setTeamName] = useState(''); // The name of the team being created
  const [showSavedTeams, setShowSavedTeams] = useState(false);  // Controls visibility of saved teams

  const numberDigimons = 98; // The number of Digimons to fetch from the API

  // Fetch saved teams from localStorage when the component mounts
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedDigimonTeams'));
    setSavedTeams(saved || {});
  }, []);

  // Store the saved teams back in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedDigimonTeams', JSON.stringify(savedTeams));
  }, [savedTeams]);

  // Function to handle search/filtering of Digimons
  const handleSearch = (filters) => {
    const params = new URLSearchParams();
    if (filters?.name) params.append('name', filters.name);
    if (filters?.selectedAttribute) params.append('attribute', filters.selectedAttribute);
    if (filters?.selectedLevel) params.append('level', filters.selectedLevel);
    if (filters?.xAntibody) params.append('xAntibody', true);
    params.append('pageSize', numberDigimons);

    fetch(`https://digi-api.com/api/v1/digimon?${params.toString()}`)
      .then((response) => response.json())
      .then((data) => setDigimons(data.content || []))
      .catch((error) => console.error('Error fetching Digimons:', error));
  };

  // Fetch Digimons when the component mounts
  useEffect(() => {
    handleSearch();
  }, []);

  // Store the current team in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('digimonTeam', JSON.stringify(team));
  }, [team]);

  // Add a Digimon to the team (in the first available empty slot)
  const addToTeam = (digimon) => {
    const emptyIndex = team.findIndex((slot) => slot === null);
    if (emptyIndex !== -1) {
      const newTeam = [...team];
      newTeam[emptyIndex] = digimon;
      setTeam(newTeam);
    } else {
      alert('El equipo ya está lleno.'); // Show alert if the team is full
    }
  };

  // Remove a Digimon from the team
  const removeFromTeam = (index) => {
    const newTeam = [...team];
    newTeam[index] = null;
    setTeam(newTeam);
  };

  // Fill the team with random Digimons (in empty slots)
  const fillTeamWithRandom = () => {
    const availableSlots = team.filter((slot) => slot === null).length;
    const randomDigimons = [...digimons].sort(() => 0.5 - Math.random());
    const newTeam = [...team];

    let index = 0;
    for (let i = 0; i < availableSlots && index < randomDigimons.length; i++) {
      const emptyIndex = newTeam.findIndex((slot) => slot === null);
      newTeam[emptyIndex] = randomDigimons[index];
      index++;
    }

    setTeam(newTeam);
  };

  // Save the team with a name
  const saveTeam = () => {
    if (!teamName) {
      alert('Please enter a name for your team.');
      return;
    }
    if (team.every((slot) => slot === null)) {
      alert('Cannot save an empty team.');
      return;
    }
    setSavedTeams((prevTeams) => ({ ...prevTeams, [teamName]: team }));
    setTeamName('');
    alert('Team saved successfully!');
  };

  // Load a saved team by name
  const loadTeam = (name) => {
    const selectedTeam = savedTeams[name];
    if (selectedTeam) {
      setTeam(selectedTeam);
    } else {
      alert('This team does not exist.');
    }
  };

  // Delete a saved team by name
  const deleteTeam = (teamName) => {
    const updatedTeams = { ...savedTeams };
    delete updatedTeams[teamName];
    setSavedTeams(updatedTeams);
    localStorage.setItem('savedTeams', JSON.stringify(updatedTeams));
  };

  return (
    <div className='page-content-3'>
      <div className="parallax-background-2">
        <h2 className="title-team-2">CREATE YOUR OWN DIGIMON TEAM</h2>
      </div>
      <div className='filter-team team'>
        {/* Filter bar for searching Digimons */}
        <FilterBar onSearch={handleSearch} />

        <div className='team-general'>
          <div className='team-management'>
            {/* Input for team name */}
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
            />
            {/* Button to save the team */}
            <button onClick={saveTeam}>Save Team</button>
          </div>

          <div className="team-container">
            {/* Render the Digimon team */}
            {team.map((digimon, index) => (
              <div
                key={index}
                className={`team-slot ${digimon ? 'has-digimon' : ''}`}
                onClick={() => digimon && removeFromTeam(index)}
              >
                {digimon ? (
                  <>
                    <img src={digimon.image} alt={digimon.name} title="Click to remove" />
                    <div className="overlay">
                      <span>Remove</span>
                    </div>
                  </>
                ) : (
                  <img src={eggImage} alt="Empty Slot" title="Empty slot" />
                )}
              </div>
            ))}
          </div>

          {/* Button to fill the team with random Digimons */}
          <button className='fill' onClick={fillTeamWithRandom} disabled={team.every((slot) => slot !== null)}>
            Fill Team with Random Digimons
          </button>

          {/* Button to toggle visibility of saved teams */}
          <button onClick={() => setShowSavedTeams(prevState => !prevState)}>
            {showSavedTeams ? 'Hide my teams' : 'View my teams'}
          </button>
        </div>
      </div>
      {/* Conditionally render the saved teams */}
      {showSavedTeams && (
        <div className="saved-teams-container">
          <h3>SAVED TEAMS</h3>
          {Object.keys(savedTeams).length > 0 ? (
            <ul className="saved-teams-list">
              {Object.keys(savedTeams).map((name) => (
                <li key={name} className="saved-team-item">
                  <span className="team-name">{name}</span>
                  {/* Load or delete saved teams */}
                  <div className="buttons-container">
                    <button onClick={() => loadTeam(name)} className="load-btn">
                      Load
                    </button>
                    <button onClick={() => deleteTeam(name)} className="delete-btn">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No saved teams available.</p>
          )}
        </div>
      )}
      <div className="digimons-container-3">
        {/* Render Digimons from the API */}
        {digimons.length > 0 ? (
          digimons.map((digimon) => (
            <div className='digimon-card-3' key={digimon.id} onClick={() => addToTeam(digimon)}>
              <img src={digimon.image} alt={digimon.name} />
            </div>
          ))
        ) : (
          <p>No Digimons found with the selected filters.</p>
        )}
      </div>
    </div>
  );
}

export default DigimonTeam;
