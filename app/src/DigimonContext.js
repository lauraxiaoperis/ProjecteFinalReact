import React, { createContext, useState, useEffect } from 'react';

// Crear un Contexto llamado DigimonContext
const DigimonContext = createContext();

// Este componente 'DigimonProvider' envolverá a otros componentes 
// para que puedan acceder al contexto
export const DigimonProvider = ({ children }) => {
  const [filteredAttributeName, setFilteredAttributeName] = useState([]); // Estado para almacenar los nombres de los atributos

  const apiUrls = {
    attribute: 'https://digi-api.com/api/v1/attribute', // URL para obtener los atributos de Digimon
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

  return (
    // Proveemos (compartimos) el estado de los atributos para que otros componentes lo usen
    <DigimonContext.Provider value={{ filteredAttributeName }}>
      {children} {/* Todos los componentes hijos pueden acceder al contexto */}
    </DigimonContext.Provider>
  );
};

export default DigimonContext;
