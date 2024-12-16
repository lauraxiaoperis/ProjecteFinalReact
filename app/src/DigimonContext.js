import React, { createContext, useState, useEffect } from 'react';

// Crear un Contexto llamado DigimonContext
const DigimonContext = createContext();

// Este componente 'DigimonProvider' envolverá a otros componentes 
// para que puedan acceder al contexto
export const DigimonProvider = ({ children }) => {
  const [filteredAttributeName, setFilteredAttributeName] = useState([]); // Estado para almacenar los nombres de los atributos
  const [levels, setLevels] = useState([]); // Estado para almacenar los niveles

  const apiUrls = {
    attribute: 'https://digi-api.com/api/v1/attribute', // URL para obtener los atributos de Digimon
    level: 'https://digi-api.com/api/v1/level' // URL para obtener los niveles de Digimon
  };

  // Este efecto obtiene los atributos al cargar el componente
  useEffect(() => {
    fetch(apiUrls.attribute) // Hacemos la petición a la API
      .then((response) => response.json()) // Convertimos la respuesta a JSON
      .then((data) => {
        if (data.content && data.content.fields) {
          // Si hay atributos, extraemos los nombres
          const attributeNames = data.content.fields.map((field) => field.name);
          setFilteredAttributeName(attributeNames); // Guardamos los nombres en el estado
        }
      })
      .catch((error) => {
        console.error('Error fetching Digimons attributes:', error); // Si hay error, lo mostramos
      });
  }, []);

  // Este efecto obtiene los niveles al cargar el componente
  useEffect(() => {
    fetch(apiUrls.level) // Hacemos la petición a la API para los niveles
      .then((response) => response.json())
      .then((data) => {
        if (data.content && data.content.fields) {
          // Si hay niveles, extraemos los nombres
          const levelNames = data.content.fields.map((field) => field.name);
          setLevels(levelNames); // Guardamos los nombres en el estado
        }
      })
      .catch((error) => {
        console.error('Error fetching levels:', error); // Si hay error, lo mostramos
      });
  }, []);

  return (
    // Proveemos (compartimos) el estado de los atributos y niveles para que otros componentes los usen
    <DigimonContext.Provider value={{ filteredAttributeName, levels }}>
      {children} {/* Todos los componentes hijos pueden acceder al contexto */}
    </DigimonContext.Provider>
  );
};

export default DigimonContext;