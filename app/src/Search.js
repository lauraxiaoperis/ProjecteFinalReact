import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import DigimonContext from './DigimonContext';  // Importamos el contexto
import './App.css';

function Search(){
    const [filteredDigimons, setFilteredDigimons] = useState([]); // Estado para almacenar los Digimons filtrados por atributo
    const { filteredAttributeName } = useContext(DigimonContext); // Accedemos al contexto solo para los atributos
    return(
        <div>Search</div>
        
    );
}

export default Search;