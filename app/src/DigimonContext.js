import React, { createContext, useState, useEffect } from 'react';

// Create a Context named DigimonContext
const DigimonContext = createContext();

// This 'DigimonProvider' component will wrap other components
// so they can access the context
export const DigimonProvider = ({ children }) => {
  const [filteredAttributeName, setFilteredAttributeName] = useState([]); // State to store attribute names
  const [levels, setLevels] = useState([]); // State to store levels

  const apiUrls = {
    attribute: 'https://digi-api.com/api/v1/attribute', // URL to fetch Digimon attributes
    level: 'https://digi-api.com/api/v1/level' // URL to fetch Digimon levels
  };

  // This effect fetches attributes when the component loads
  useEffect(() => {
    fetch(apiUrls.attribute) // Make the API request
      .then((response) => response.json()) // Convert the response to JSON
      .then((data) => {
        if (data.content && data.content.fields) {
          // If attributes are available, extract the names
          const attributeNames = data.content.fields.map((field) => field.name);
          setFilteredAttributeName(attributeNames); // Save the names in the state
        }
      })
      .catch((error) => {
        console.error('Error fetching Digimons attributes:', error); // Log errors if any
      });
  }, []);

  // This effect fetches levels when the component loads
  useEffect(() => {
    fetch(apiUrls.level) // Make the API request for levels
      .then((response) => response.json())
      .then((data) => {
        if (data.content && data.content.fields) {
          // If levels are available, extract the names
          const levelNames = data.content.fields.map((field) => field.name);
          setLevels(levelNames); // Save the names in the state
        }
      })
      .catch((error) => {
        console.error('Error fetching levels:', error); // Log errors if any
      });
  }, []);

  return (
    // Provide (share) the state of attributes and levels so other components can use them
    <DigimonContext.Provider value={{ filteredAttributeName, levels }}>
      {children} {/* All child components can access the context */}
    </DigimonContext.Provider>
  );
};

export default DigimonContext;
