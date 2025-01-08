import React, { useState, useEffect } from 'react';  // Import React, useState, and useEffect hooks
import FilterBar from './FilterBar'; // Component to filter the Digimons
import eggImage from './images/digimon_egg.jpg'; // Placeholder image for empty team slots
import './App.css';  // General styles for the application
import './Team.css'; // Specific styles for the DigimonTeam component

function DigimonTeam() {
  const [digimons, setDigimons] = useState([]); // State to store Digimons fetched from API
  const [team, setTeam] = useState(Array(6).fill(null)); // State for the user's team, initially 6 empty slots
  const [savedTeams, setSavedTeams] = useState({}); // State to store saved teams by name
  const [teamName, setTeamName] = useState(''); // State to store the name of the team being saved

  const numberDigimons = 98; // Limit of Digimons fetched per page

  // Load saved teams from localStorage when the component mounts
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedDigimonTeams')); // Parse saved teams from localStorage
    setSavedTeams(saved || {}); // Initialize with saved teams or empty object
  }, []);

  // Save all teams to localStorage whenever savedTeams is updated
  useEffect(() => {
    localStorage.setItem('savedDigimonTeams', JSON.stringify(savedTeams)); // Save updated teams to localStorage
  }, [savedTeams]);

  // Function to fetch Digimons based on filters
  const handleSearch = (filters) => {
    const params = new URLSearchParams(); // Initialize query parameters for API call

    // Append filters to the query if provided
    if (filters?.name) params.append('name', filters.name);
    if (filters?.selectedAttribute) params.append('attribute', filters.selectedAttribute);
    if (filters?.selectedLevel) params.append('level', filters.selectedLevel);
    if (filters?.xAntibody) params.append('xAntibody', true);
    params.append('pageSize', numberDigimons); // Limit results

    fetch(`https://digi-api.com/api/v1/digimon?${params.toString()}`) // API call with query
      .then((response) => response.json()) // Parse JSON response
      .then((data) => setDigimons(data.content || [])) // Update state with fetched Digimons
      .catch((error) => console.error('Error fetching Digimons:', error)); // Handle errors
  };

  // Fetch Digimons when the component mounts
  useEffect(() => {
    handleSearch(); // Fetch Digimons with no filters initially
  }, []);

  // Save the current team to localStorage whenever the team changes
  useEffect(() => {
    localStorage.setItem('digimonTeam', JSON.stringify(team)); // Store team in localStorage
  }, [team]);

  // Add a selected Digimon to the team
  const addToTeam = (digimon) => {
    const emptyIndex = team.findIndex((slot) => slot === null); // Find first empty slot
    if (emptyIndex !== -1) {
      const newTeam = [...team]; // Create a copy of the team
      newTeam[emptyIndex] = digimon; // Place the Digimon in the empty slot
      setTeam(newTeam); // Update the team state
    } else {
      alert('El equipo ya está lleno.'); // Notify if team is full
    }
  };

  // Remove a Digimon from the team
  const removeFromTeam = (index) => {
    const newTeam = [...team]; // Create a copy of the team
    newTeam[index] = null; // Remove the Digimon from the selected slot
    setTeam(newTeam); // Update the team state
  };

  // Fill empty slots in the team with random Digimons
  const fillTeamWithRandom = () => {
    const availableSlots = team.filter((slot) => slot === null).length; // Count empty slots
    const randomDigimons = [...digimons].sort(() => 0.5 - Math.random()); // Shuffle Digimons
    const newTeam = [...team]; // Create a copy of the team

    let index = 0;
    for (let i = 0; i < availableSlots && index < randomDigimons.length; i++) {
      const emptyIndex = newTeam.findIndex((slot) => slot === null); // Find next empty slot
      newTeam[emptyIndex] = randomDigimons[index]; // Add random Digimon
      index++; // Move to next Digimon
    }

    setTeam(newTeam); // Update the team state
  };

  // Save the current team with a specified name
  const saveTeam = () => {
    if (!teamName) {
      alert('Please enter a name for your team.'); // Ensure a name is provided
      return;
    }
    if (team.every((slot) => slot === null)) {
      alert('Cannot save an empty team.'); // Ensure team is not empty
      return;
    }
    setSavedTeams((prevTeams) => ({ ...prevTeams, [teamName]: team })); // Save the team
    setTeamName(''); // Clear the team name input
    alert('Team saved successfully!'); // Notify user
  };

  // Load a saved team into the current team state
  const loadTeam = (name) => {
    const selectedTeam = savedTeams[name]; // Get the selected team
    if (selectedTeam) {
      setTeam(selectedTeam); // Update the team state
    } else {
      alert('This team does not exist.'); // Notify if team not found
    }
  };

  // Delete a saved team
  const deleteTeam = (teamName) => {
    const updatedTeams = { ...savedTeams }; // Create a copy of saved teams
    delete updatedTeams[teamName]; // Remove the team by name
    setSavedTeams(updatedTeams); // Update state
    localStorage.setItem('savedTeams', JSON.stringify(updatedTeams)); // Save changes to localStorage
  };

  return (
    <div className='page-content-3'>
      <div className="parallax-background-2">
        <h2 className="title-team-2">CREATE YOUR OWN DIGIMON TEAM</h2>
      </div>
      <div className='filter-team team'>
        <FilterBar onSearch={handleSearch} /> {/* Component to apply search filters */}

        <div className='team-general'>
          <div className="team-container"> {/* Display user's team */}
            {team.map((digimon, index) => (
              <div
                key={index}
                className={`team-slot ${digimon ? 'has-digimon' : ''}`}
                onClick={() => digimon && removeFromTeam(index)} // Remove Digimon on click
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

          <div className='ran-button'>
            <button onClick={fillTeamWithRandom} disabled={team.every((slot) => slot !== null)}> {/* Disable if team is full */}
              Fill Team with Random Digimons
            </button>
          </div>

          <div className='team-management'>
            <input
              type="text"
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter team name"
            />
            <button onClick={saveTeam}>Save Team</button>
          </div>
        </div>
      </div>

      <div className="saved-teams-container"> {/* Section to display saved teams */}
        <h3>Saved Teams</h3>
        {Object.keys(savedTeams).length > 0 ? (
          <ul className="saved-teams-list">
            {Object.keys(savedTeams).map((name) => (
              <li key={name} className="saved-team-item">
                {name}
                <button onClick={() => loadTeam(name)}>Load</button>
                <button onClick={() => deleteTeam(name)} style={{ marginLeft: '10px' }}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No saved teams available.</p>
        )}
      </div>

      <div className="digimons-container-3"> {/* Display list of Digimons */}
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
