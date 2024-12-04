import React, { useState, useEffect } from 'react';
import DigimonCard from './DigimonCard'; 
import './App.css';

function DigimonsList() {
    const [digimons, setDigimons] = useState([]); // Estado para almacenar todos los Digimons
    const [filteredAttributeName, setFilteredAttributeName] = useState([]); 
    const [filteredDigimons, setFilteredDigimons] = useState([]); // Estado para almacenar los Digimons filtrados por atributo

    const numberDigimons = 20;
    // Array con las URLs de las APIs
    const apiUrls = {
        digimons: `https://digi-api.com/api/v1/digimon?pageSize=${numberDigimons}`,
        attribute: 'https://digi-api.com/api/v1/attribute',
    };
    
    // General - Digimon List
    useEffect(() => {
        // Solicitar Digimons generales
        fetch(apiUrls.digimons)
            .then((response) => response.json())
            .then((data) => {
                setDigimons(data.content || []);
            })
            .catch((error) => {
                console.error('Error fetching Digimons:', error);
            });
    }, []); 

    // Random Attribute - Digimon List
    useEffect(() => {
        fetch(apiUrls.attribute)
            .then((response) => response.json())
            .then((data) => {
                if(data.content && data.content.fields){
                    const attributeNames = data.content.fields.map(field => field.name);
                    setFilteredAttributeName(attributeNames);
                }
            })
            .catch((error) => {
                console.error('Error fetching Digimons:', error);
            });
    }, []); 

    return (
        <div>
            {/* Llista inicial de Digimons */}
            <h2>Lista de Digimons</h2>
            <div className="digimons-container">
                {digimons.length > 0 ? (
                    // Si hay Digimons, mapeamos y mostramos las tarjetas
                    digimons.map((digimon) => (
                        <DigimonCard
                            key={digimon.id} 
                            title={digimon.name} 
                            imageUrl={digimon.image} 
                        />
                    ))
                ) : (
                    <p>No se encontraron Digimons</p> // Si no se encuentran Digimons
                )}
            </div>

            {/* Llista de Digimons filtrados por atributo */}
            <h2>Digimons filtrados por atributo: {filteredAttributeName || 'Ninguno'}</h2>
        </div>
    );
}

export default DigimonsList;

