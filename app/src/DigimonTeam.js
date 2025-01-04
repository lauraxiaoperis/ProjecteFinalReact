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
  const [team, setTeam] = useState(() => {
    // Load the team from localStorage if available, otherwise initialize to 6 empty slots
    const savedTeam = JSON.parse(localStorage.getItem('digimonTeam'));
    return savedTeam || Array(6).fill(null); // Default to 6 empty slots
  });
  
  const numberDigimons = 98; // Number of Digimons to fetch per page

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

  return (
    <div className='page-content-3'>
      <div className="parallax-background-2">
        <h2 className="title-team-2">CREATE YOUR OWN DIGIMON TEAM</h2>
      </div>
      <div className='filter-team team'>
        {/* FilterBar component for the user to apply filters */}
        <FilterBar onSearch={handleSearch} />
        <div className='team-general'>
          {/* Team container to display the team slots (6 slots in total) */}
          <div className="team-container">
            {team.map((digimon, index) => (
              <div
                key={index}
                className={`team-slot ${digimon ? 'has-digimon' : ''}`}
                onClick={() => digimon && removeFromTeam(index)}  // Remove the Digimon if there's one in the slot
              >
                {/* If there's a Digimon in the slot, show its image; otherwise, show the egg image */}
                {digimon ? (
                  <img src={digimon.image} alt={digimon.name} title="Click to remove" />
                ) : (
                  <img src={eggImage} alt="Empty Slot" title="Empty slot" />
                )}
                {digimon && (
                  <div className="overlay">
                    <span>Remove</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className='ran-button'>
            {/* Button to fill the team with random Digimons */}
            <button onClick={fillTeamWithRandom} disabled={team.every((slot) => slot !== null)}>
              Fill Team with Random Digimons
            </button>
          </div>
        </div>
      </div>

      {/* List of available Digimons to add to the team */}
      <div className="digimons-container-3">
        {digimons.length > 0 ? (
          digimons.map((digimon) => (
            <div className='digimon-card-3' key={digimon.id} onClick={() => addToTeam(digimon)}>
              < img src={digimon.image} alt={digimon.name} />
            </div>
          ))
        ) : (
          <p>No Digimons found with the selected filters.</p>  // Display message if no Digimons are found
        )}
      </div>
    </div>
  );
}

export default DigimonTeam;
