import React, { useState, useEffect } from 'react';  
import { Link } from 'react-router-dom';  
import DigimonCard from './DigimonCard';  
import FilterBar from './FilterBar';  
import eggImage from './images/digimon_egg.jpg';  
import './App.css';  
import './Team.css';

function DigimonTeam() {
  const [digimons, setDigimons] = useState([]); // List of Digimons fetched from API
  const [team, setTeam] = useState(Array(6).fill(null)); // The team of 6 Digimons (empty initially)
  const [savedTeams, setSavedTeams] = useState({}); // Object holding saved teams
  const [teamName, setTeamName] = useState(''); // The name of the team being created
  const [showSavedTeams, setShowSavedTeams] = useState(false);  // Controls visibility of saved teams

  const [currentPage, setCurrentPage] = useState(0); // Current page of the general list
  const [totalPages, setTotalPages] = useState(0); // Total pages of the general list

  const numberDigimons = 98; // Number of Digimons per page

  // Fetch saved teams from localStorage when the component mounts
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedDigimonTeams'));
    setSavedTeams(saved || {}); // Load saved teams or initialize an empty object
  }, []);

  // Store the saved teams back in localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('savedDigimonTeams', JSON.stringify(savedTeams));  // Save all teams to localStorage whenever savedTeams is updated
  }, [savedTeams]);

  // Fetch Digimons for the current page
  const fetchDigimons = () => {
    fetch(`https://digi-api.com/api/v1/digimon?pageSize=${numberDigimons}&page=${currentPage}`)
      .then((response) => response.json())
      .then((data) => {
        setDigimons(data.content || []);
        setTotalPages(data.pageable.totalPages || 1);
      })
      .catch((error) => console.error('Error fetching Digimons:', error));
  };

  useEffect(() => {
    fetchDigimons();  // useEffect hook to load Digimons without any filters when the component is mounted
  }, [currentPage]);

  // Store the current team in localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('digimonTeam', JSON.stringify(team)); // useEffect hook to save the team to localStorage whenever the team changes
  }, [team]);

  const addToTeam = (digimon) => {
    const emptyIndex = team.findIndex((slot) => slot === null);  // Find the first empty slot in the team
    if (emptyIndex !== -1) {  // Check if there's an empty slot
      const newTeam = [...team];  // Create a copy of the current team array
      newTeam[emptyIndex] = digimon;  // Add the selected Digimon to the first empty slot
      setTeam(newTeam);  // Update the team state with the new team
    } else {
      alert('El equipo ya está lleno.');  // Alert if the team is already full
    }
  };

  const removeFromTeam = (index) => {
    const newTeam = [...team];  // Create a copy of the current team array
    newTeam[index] = null;  // Set the selected slot to null, effectively removing the Digimon
    setTeam(newTeam);  // Update the team state with the modified team
  };

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

  const loadTeam = (name) => {
    const selectedTeam = savedTeams[name];
    if (selectedTeam) {
      setTeam(selectedTeam);
    } else {
      alert('This team does not exist.');
    }
  };

  const deleteTeam = (teamName) => {
    const updatedTeams = { ...savedTeams };
    delete updatedTeams[teamName];  // Remove the team with the given name
    setSavedTeams(updatedTeams);  // Update the state
    localStorage.setItem('savedTeams', JSON.stringify(updatedTeams));
  };

  const goToPage = (pageNumber) => {
    if (pageNumber >= 0 && pageNumber < totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const renderPageButtons = () => {
    let pages = [];
    const leftBound = Math.max(currentPage - 2, 0);
    const rightBound = Math.min(currentPage + 2, totalPages - 1);

    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }

    return pages.map((page) => (
      <button 
        key={page}
        onClick={() => goToPage(page)} 
        className={page === currentPage ? 'active' : ''}
      >
        {page + 1}
      </button>
    ));
  };

  return (
    <div className='page-content-3'>
      <div className="parallax-background-2">
        <h2 className="title-team-2">CREATE YOUR OWN DIGIMON TEAM</h2>
      </div>
      <div className='filter-team team'>
        <FilterBar onSearch={fetchDigimons} />  {/* FilterBar to filter Digimons */}

        <div className='team-general'>
          <div className='team-management'>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
            />
            <button onClick={saveTeam}>Save Team</button>
          </div>

          <div className="team-container">
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

          <button className='fill' onClick={() => {}} disabled={team.every((slot) => slot !== null)}>
            Fill Team with Random Digimons
          </button>

          <button onClick={() => setShowSavedTeams((prevState) => !prevState)}>
            {showSavedTeams ? 'Hide my teams' : 'View my teams'}
          </button>
        </div>
      </div>
      {showSavedTeams && (
        <div className="saved-teams-container">
          <h3>SAVED TEAMS</h3>
          {Object.keys(savedTeams).length > 0 ? (
            <ul className="saved-teams-list">
              {Object.keys(savedTeams).map((name) => (
                <li key={name} className="saved-team-item">
                  <span className="team-name">{name}</span>
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

      <div className="pagination">
        <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0}>Previous</button>
        {renderPageButtons()}
        <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages - 1}>Next</button>
      </div>
    </div>
  );
}

export default DigimonTeam;