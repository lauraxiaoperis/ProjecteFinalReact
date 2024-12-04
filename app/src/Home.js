import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DigimonCard from './DigimonCard'; 
import './App.css';

function DigimonsList() {
    const [digimons, setDigimons] = useState([]); // Estado para almacenar todos los Digimons
    const [filteredAttributeName, setFilteredAttributeName] = useState([]); //Array con los tipos de atributos que hay
    const [randomAttribute, setRandomAttribute] = useState(''); // Atributo aleatorio
    const [filteredDigimons, setFilteredDigimons] = useState([]); // Estado para almacenar los Digimons filtrados por atributo

    const numberDigimons = 20;
    // APIs URL
    const apiUrls = {
        digimons: `https://digi-api.com/api/v1/digimon?pageSize=${numberDigimons}`,
        attribute: 'https://digi-api.com/api/v1/attribute',
    };
    
    // =============== Fetch - General - Digimon List =============== 
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

    // =============== Fetch - Digimon Attribute  =============== 
    useEffect(() => {
        fetch(apiUrls.attribute)
            .then((response) => response.json())
            .then((data) => {
                if (data.content && data.content.fields) {
                    // Obtener los nombres de los atributos
                    const attributeNames = data.content.fields.map(field => field.name);
                    setFilteredAttributeName(attributeNames);
                }
            })
            .catch((error) => {
                console.error('Error fetching Digimons attributes:', error);
            });
    }, []); 
    
    // =============== Fetch - Digimon List - Random Attribute  =============== 
    useEffect(() => {
        if (filteredAttributeName.length > 0) {
            // Random Attribute
            const ranAttribute = filteredAttributeName[Math.floor(Math.random() * filteredAttributeName.length)];
           // console.log("Random Attribute:", ranAttribute); 
            setRandomAttribute(ranAttribute);
    
            // Realiza el fetch para obtener los Digimons basados en el atributo
            fetch(`https://digi-api.com/api/v1/digimon?attribute=${ranAttribute}&&pageSize=${numberDigimons}`)
                .then((response) => response.json())
                .then((data) => {
                    setFilteredDigimons(data.content || []);
                })
                .catch((error) => {
                    console.error('Error fetching Random Digimons List:', error);
                });
        }
    }, [filteredAttributeName]); // This useEffect runs every time filteredAttributeName changes
    
    

    return (
        <div>
            {/*  =============== General Digimon List ===============  */}
            <h2>Lista de Digimons</h2>
            <div className="digimons-container">
                {digimons.length > 0 ? (
                    // Si hay Digimons, mapeamos y mostramos las tarjetas
                    digimons.map((digimon) => (
                        <Link key={digimon.id} to={`/digimon/${digimon.id}`}>  {/*  Link para el detalle  */}
                            <DigimonCard
                                key={digimon.id} 
                                title={digimon.name} 
                                imageUrl={digimon.image} 
                            />
                        </Link>
                    ))
                ) : (
                    <p>No se encontraron Digimons</p> // Si no se encuentran Digimons
                )}
            </div>

            {/* =============== Random Attribute - Digimon List =============== */}
            <h2>Digimons filtered by attribute: {randomAttribute || 'Ninguno'}</h2>
            <div className="digimons-container">
            {filteredDigimons.length > 0 ? (
                    filteredDigimons.map((digimon) => (
                        <DigimonCard
                            key={digimon.id} 
                            title={digimon.name} 
                            imageUrl={digimon.image} 
                        />
                    ))
                ) : (
                    <p>There are no Digimons with this attribute.</p> 
                )}
            </div>
        </div>
    );
}

export default DigimonsList;

