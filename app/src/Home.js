import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import DigimonCard from './DigimonCard'; 
import DigimonContext from './DigimonContext';  // Importamos el contexto
import './App.css';

function DigimonsList() {
    const [digimons, setDigimons] = useState([]); // Estado para almacenar todos los Digimons
    const [randomAttribute, setRandomAttribute] = useState(''); // Atributo aleatorio
    const [filteredDigimons, setFilteredDigimons] = useState([]); // Estado para almacenar los Digimons filtrados por atributo

    const { filteredAttributeName } = useContext(DigimonContext); // Accedemos al contexto solo para los atributos

    const numberDigimons = 20;
    
    // =============== Fetch - General - Digimon List =============== 
    useEffect(() => {
        // Solicitar Digimons generales
        fetch(`https://digi-api.com/api/v1/digimon?pageSize=${numberDigimons}`)
            .then((response) => response.json())
            .then((data) => {
                setDigimons(data.content || []);
            })
            .catch((error) => {
                console.error('Error fetching Digimons:', error);
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
                        <Link key={digimon.id} to={`/digimon/${digimon.id}`}>  {/*  Link para el detalle  */}
                            <DigimonCard
                                key={digimon.id} 
                                title={digimon.name} 
                                imageUrl={digimon.image} 
                            />
                        </Link>
                    ))
                ) : (
                    <p>There are no Digimons with this attribute.</p> 
                )}
            </div>
        </div>
    );
}

export default DigimonsList;

