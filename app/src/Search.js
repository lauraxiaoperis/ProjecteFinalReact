import React, { useState, useEffect, useContext } from 'react'; 
import { Link } from 'react-router-dom';
import DigimonCard from './DigimonCard'; // Import the component to display Digimon cards
import FilterBar from './FilterBar';
import DigimonContext from './DigimonContext'; // Import the context containing the list of attributes
import './App.css';

function Search() {
  const [digimons, setDigimons] = useState([]); // Stores the Digimons returned by the API after applying filters
  const numberDigimons = 1000; // Number of Digimons to fetch per page
  
   // Use context to get both attributes and levels
   const { filteredAttributeName, levels } = useContext(DigimonContext);

 
  /**
   * Function handleSearch: Fetches Digimons based on the filter values.
   * @param {Object} filters - Object containing filter parameters:
   *   - name: Filter by name
   *   - selectedAttribute: Filter by attribute
   *   - xAntibody: Filter by xAntibody
   *   - selectedLevel: Filter by level
   */
  const handleSearch = (filters) => {

    // URLSearchParams() stores the filters selected by the user as query parameters
    // URLSearchParams ensures the parameters are properly formatted (?x=value)
    const params = new URLSearchParams();
    // If the user entered a name, add the "name" parameter with the corresponding value
    if (filters.name) params.append('name', filters.name);
    // Add the "attribute" parameter if selected
    if (filters.selectedAttribute) params.append('attribute', filters.selectedAttribute);
    // Add the "level" parameter if selected
    if (filters.selectedLevel) params.append('level', filters.selectedLevel);
    if (filters.xAntibody) params.append('xAntibody', true); // Include only if true
    // Add a "pageSize" parameter to determine the number of results returned
    params.append('pageSize', numberDigimons);
    
    // Convert all accumulated parameters in "params" into a query string
    const queryString = params.toString();

    // Incorporate the query string into the API URL
    fetch(`https://digi-api.com/api/v1/digimon?${queryString}`)
      .then((response) => response.json())
      .then((data) => {
        setDigimons(data.content || []); // Save the list of Digimons(update digimons state)
       // console.log(`https://digi-api.com/api/v1/digimon?${queryString}`);
      })
      .catch((error) => console.error('Error fetching Digimons:', error));
  };

  return (
    <div className='page-content-2'>
      {/* We use Filter bar component to handle filter inputs */}
      <FilterBar onSearch={handleSearch} />

      <div className="digimons-container-2">
        {/* Display Digimon cards*/}
        {digimons.length > 0 ? (
          digimons.map((digimon) => (
            <Link key={digimon.id} to={`/digimon/${digimon.id}`}>
              <DigimonCard title={digimon.name} imageUrl={digimon.image} additionalClass="digimon-card-2"/>
            </Link>
          ))
        ) : (
          <p></p>
        )}
      </div>
    </div>
  );
}

export default Search;