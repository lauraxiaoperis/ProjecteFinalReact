import React, { useState, useEffect } from 'react';  // Import React, useState, and useEffect hooks
import { Link } from 'react-router-dom';  // Import Link for navigation (not used directly here, but can be useful for routing)
import DigimonCard from './DigimonCard';  // Import DigimonCard to display individual Digimons
import FilterBar from './FilterBar';  // Import the FilterBar component to allow filtering Digimons
import eggImage from './images/digimon_egg.jpg';  // Import egg image for empty slots
import './App.css';  // Import CSS for styling
import './Team.css';

function DigimonTeam() {
  // Load the team from localStorage if available, otherwise initialize an empty team
  const [digimons, setDigimons] = useState([]); // List of Digimons fetched from the API
  const [team, setTeam] = useState(Array(6).fill(null)); // Team array with 6 slots, initially empty (null)
  const [savedTeams, setSavedTeams] = useState({}); // Object to store saved teams with names
  const [teamName, setTeamName] = useState(''); // Name for the current team to be saved
  
  const numberDigimons = 98; // Number of Digimons to fe tch per page

  // Load saved teams from localStorage when the component mounts
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('savedDigimonTeams'));
    setSavedTeams(saved || {}); // Load saved teams or initialize an empty object
  }, []);

  // Save all teams to localStorage whenever savedTeams is updated
  useEffect(() => {
    localStorage.setItem('savedDigimonTeams', JSON.stringify(savedTeams));
  }, [savedTeams]);


  // handleSearch function to fetch Digimons based on the user's filters
  const handleSearch = (filters) => {
    const params = new URLSearchParams();  // Prepare query parameters for the API call

    // Add filters to the query parameters if provided
    if (filters?.name) params.append('name', filters.name);
    if (filters?.selectedAttribute) params.append('attribute', filters.selectedAttribute);
    if (filters?.selectedLevel) params.append('level', filters.selectedLevel);
    if (filters?.xAntibody) params.append('xAntibody', true);
    params.append('pageSize', numberDigimons); // Limit the number of Digimons fetched

    // Fetch Digimons from the API with the constructed query parameters
    fetch(`https://digi-api.com/api/v1/digimon?${params.toString()}`)
      .then((response) => response.json())  // Parse the JSON response
      .then((data) => setDigimons(data.content || []))  // Update the state with the fetched Digimons
      .catch((error) => console.error('Error fetching Digimons:', error));  // Handle errors during fetch
  };

  // useEffect hook to load Digimons without any filters when the component is mounted
  useEffect(() => {
    handleSearch();  // Fetch Digimons without filters when the component is loaded
  }, []);  // Empty dependency array ensures this runs only once when the component mounts

  // useEffect hook to save the team to localStorage whenever the team changes
  useEffect(() => {
    localStorage.setItem('digimonTeam', JSON.stringify(team));  // Save the team to localStorage as a JSON string
  }, [team]);  // This hook runs whenever the team changes

  // addToTeam function to add a selected Digimon to the team
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

  // removeFromTeam function to remove a Digimon from the team
  const removeFromTeam = (index) => {
    const newTeam = [...team];  // Create a copy of the current team array
    newTeam[index] = null;  // Set the selected slot to null, effectively removing the Digimon
    setTeam(newTeam);  // Update the team state with the modified team
  };

  // fillTeamWithRandom function to fill the team with random Digimons
  const fillTeamWithRandom = () => {
    const availableSlots = team.filter((slot) => slot === null).length;  // Count the number of empty slots
    const randomDigimons = [...digimons].sort(() => 0.5 - Math.random());  // Shuffle the Digimons list
    const newTeam = [...team];  // Create a copy of the current team array

    let index = 0;
    for (let i = 0; i < availableSlots && index < randomDigimons.length; i++) {
      const emptyIndex = newTeam.findIndex((slot) => slot === null);  // Find the first empty slot
      newTeam[emptyIndex] = randomDigimons[index];  // Add a random Digimon to the empty slot
      index++;  // Move to the next random Digimon
    }

    setTeam(newTeam);  // Update the team state with the newly filled team
  };

// Save the current team with a specified name
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
  setTeamName(''); // Clear the input after saving
  alert('Team saved successfully!');
};

// Load a saved team into the current team
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
  delete updatedTeams[teamName]; // Remove the team with the given name
  setSavedTeams(updatedTeams); // Update the state
  localStorage.setItem('savedTeams', JSON.stringify(updatedTeams));
};

return (
  <div>
    <h2>My Digimon Team</h2>

    {/* FilterBar to filter Digimons */}
    <FilterBar onSearch={handleSearch} />

    {/* Display the current team */}
    <div className="team-container">
      {team.map((digimon, index) => (
        <div
          key={index}
          className="team-slot"
          onClick={() => digimon && removeFromTeam(index)}
        >
          {digimon ? (
            <img src={digimon.image} alt={digimon.name} title="Click to remove" />
          ) : (
            <img src={eggImage} alt="Empty Slot" title="Empty slot" />
          )}
        </div>
      ))}
    </div>

    {/* Buttons to manage the team */}
    <div>
      <button onClick={fillTeamWithRandom} disabled={team.every((slot) => slot !== null)}>
        Fill Team with Random Digimons
      </button>
      <input
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
        placeholder="Enter team name"
      />
      <button onClick={saveTeam}>Save Team</button>
    </div>

    {/* Display saved teams with name and button to load and delete*/}
    <div>
      <h3>Saved Teams</h3>
      {Object.keys(savedTeams).length > 0 ? (
        <ul>
          {Object.keys(savedTeams).map((name) => (
            <li key={name}>
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

    {/* List of Digimons */}
    <div className="digimons-container">
      {digimons.length > 0 ? (
        digimons.map((digimon) => (
          <div key={digimon.id} onClick={() => addToTeam(digimon)}>
            <DigimonCard title={digimon.name} imageUrl={digimon.image} />
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
