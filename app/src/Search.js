import React, { useState, useEffect, useContext } from 'react'; 
import DigimonCard from './DigimonCard';//importamos el componente para mostrar las tarjetas
import DigimonContext from './DigimonContext'; //importamos el contexto que contiene la lista de atributos
import './App.css';

function Search() {
  const [digimons, setDigimons] = useState([]); // Almacena los digimons que devuelve la API después de aplicar los filtros
  const [name, setName] = useState(''); // Almacena el nombre introducido por el usuario
  const [selectedAttribute, setSelectedAttribute] = useState(''); // Almacena el atributo seleccionado
  const [xAntibody, setXAntibody] = useState(false); // Almacena el estado de la checkbox (true o false)
  const [selectedLevel, setSelectedLevel] = useState(''); // Almacena el nivel seleccionado
  const [levels, setLevels] = useState([]); // Almacena los niveles disponibles
  
  const { filteredAttributeName } = useContext(DigimonContext); // Lista atributos obtenida desde el contexto

  const numberDigimons = 20;

  //Este useEffect se ejecuta al cargar el componente y hace un fetch para obtener los niveles
  useEffect(() => {
    fetch('https://digi-api.com/api/v1/level')
      .then((response) => response.json())
      .then((data) => {
        //si la API devuelve datos válidos
        if (data.content && data.content.fields) {
        //extraemos los niveles del campo field 
          const levelNames = data.content.fields.map((field) => field.name);
        //y los guardamos en el estado levels
          setLevels(levelNames); 
        }
      })
      .catch((error) => console.error('Error fetching levels:', error));
  }, []);

  // Function to handle search
  const handleSearch = () => {
    const params = new URLSearchParams();

    if (name) params.append('name', name);
    if (selectedAttribute) params.append('attribute', selectedAttribute);
    if (xAntibody) params.append('xAntibody', true); // Include only if true
    if (selectedLevel) params.append('level', selectedLevel);
    params.append('pageSize', numberDigimons);

    const queryString = params.toString();

    fetch(`https://digi-api.com/api/v1/digimon?${queryString}`)
      .then((response) => response.json())
      .then((data) => {
        setDigimons(data.content || []); // Save the list of Digimons
      })
      .catch((error) => console.error('Error fetching Digimons:', error));
  };

  return (
    //Renderizamos
    
    <div>
      <h2>Search Digimons</h2>
      
      <div className="filter-container">
        {/* Filter by name*/}
        <div className="filter">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            //Al escribir, el valor se guarda en el estado "name"
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter Digimon name"
          />
        </div>

        {/* Filter by attribute */}
        <div className="filter">
          <label htmlFor="attribute">Attribute:</label>
           {/* Menú desplegable para que el usuario elija un atributo*/}
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
              //Al cambiar el estado de la checkbox se actualiza el estado xAntibody
              onChange={(e) => setXAntibody(e.target.checked)}
            />
            xAntibody
          </label>
        </div>

        {/* Filter by level */}
        {/* Similar al filtro de atributo, pero con la lista obtenida desde el fetch */}
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

        {/* Button to trigger the handleSearch function*/}
        <button onClick={handleSearch}>Search</button>
      </div>

      {/* Results */}
      <div className="digimons-container">
        {digimons.length > 0 ? (
        //Si hay digimons en el estado digimons, los mostramos usando el componente DigimonCard
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