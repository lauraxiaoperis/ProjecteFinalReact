import React, { useState, useEffect, useContext } from 'react'; 
import DigimonCard from './DigimonCard'; // Import the component to display Digimon cards
import DigimonContext from './DigimonContext'; // Import the context containing the list of attributes
import './App.css';

function Search() {
  const [digimons, setDigimons] = useState([]); // Stores the Digimons returned by the API after applying filters
  const [name, setName] = useState(''); // Stores the name entered by the user
  const [selectedAttribute, setSelectedAttribute] = useState(''); // Stores the selected attribute
  const [xAntibody, setXAntibody] = useState(false); // Stores the checkbox state (true or false)
  const [selectedLevel, setSelectedLevel] = useState(''); // Stores the selected level
  const [levels, setLevels] = useState([]); // Stores the available levels
  
  const { filteredAttributeName } = useContext(DigimonContext); // List of attributes obtained from the context

  const numberDigimons = 20;

  // This useEffect executes when the component loads and fetches the available levels
  useEffect(() => {
    fetch('https://digi-api.com/api/v1/level')
      .then((response) => response.json())
      .then((data) => {
        // If the API returns valid data
        if (data.content && data.content.fields) {
          // Extract levels from the "fields" array
          const levelNames = data.content.fields.map((field) => field.name);
          // Save the levels in the state
          setLevels(levelNames); 
        }
      })
      .catch((error) => console.error('Error fetching levels:', error));
  }, []);

  // Function to handle search
  const handleSearch = () => {

    // URLSearchParams() stores the filters selected by the user as query parameters
    // URLSearchParams ensures the parameters are properly formatted (?x=value)
    const params = new URLSearchParams();
    // If the user entered a name, add the "name" parameter with the corresponding value
    if (name) params.append('name', name);
    // Similarly, add the "attribute" parameter if selected
    if (selectedAttribute) params.append('attribute', selectedAttribute);
    // Similarly, add the "level" parameter if selected
    if (selectedLevel) params.append('level', selectedLevel);
    if (xAntibody) params.append('xAntibody', true); // Include only if true
    // Add a "pageSize" parameter to determine the number of results returned
    params.append('pageSize', numberDigimons);
    
    // Convert all accumulated parameters in "params" into a query string
    const queryString = params.toString();

    // Incorporate the query string into the API URL
    fetch(`https://digi-api.com/api/v1/digimon?${queryString}`)
      .then((response) => response.json())
      .then((data) => {
        setDigimons(data.content || []); // Save the list of Digimons
      })
      .catch((error) => console.error('Error fetching Digimons:', error));
  };

  return (
    // Render the UI
    
    <div>
      <h2>Search Digimons</h2>
      
      <div className="filter-container">
        {/* Filter by name */}
        <div className="filter">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            // On input, the value is stored in the "name" state
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Digimon name"
          />
        </div>

        {/* Filter by attribute */}
        <div className="filter">
          <label htmlFor="attribute">Attribute:</label>
          {/* Dropdown menu for the user to select an attribute */}
          <select
            id="attribute"
            value={selectedAttribute}
            onChange={(e) => setSelectedAttribute(e.target.value)}
          >
            <option value="">All</option>
            {filteredAttributeName.map((attr) => (
              <option key={attr} value={attr}>
                {attr}
              </option>
            ))}
          </select>
        </div>

        {/* Filter by xAntibody */}
        <div className="filter">
          <label>
            <input
              type="checkbox"
              checked={xAntibody}
              // When the checkbox state changes, update the "xAntibody" state
              onChange={(e) => setXAntibody(e.target.checked)}
            />
            xAntibody
          </label>
        </div>

        {/* Filter by level */}
        {/* Similar to the attribute filter but uses the list fetched from the API */}
        <div className="filter">
          <label htmlFor="level">Level:</label>
          <select
            id="level"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
          >
            <option value="">All</option>
            {levels.map((lvl) => (
              <option key={lvl} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        {/* Button to trigger the handleSearch function */}
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Results */}
      <div className="digimons-container">
        {digimons.length > 0 ? (
          // If there are Digimons in the "digimons" state, display them using the DigimonCard component
          digimons.map((digimon) => (
            <DigimonCard
              key={digimon.id}
              title={digimon.name}
              imageUrl={digimon.image}
            />
          ))
        ) : (
          <p>No Digimons found with the selected filters.</p>
        )}
      </div>
    </div>
  );
}

export default Search;