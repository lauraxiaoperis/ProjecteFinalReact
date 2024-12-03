import React, { useState, useEffect } from 'react';
import DigimonCard from './DigimonCard'; 
import './App.css';

function DigimonsList() {
    const [digimons, setDigimons] = useState([]); // Estado para almacenar todos los Digimons
    const [types, setTypes] = useState([]); // Estado para almacenar los tipos de Digimons
    const [filteredDigimons, setFilteredDigimons] = useState([]); // Estado para almacenar los Digimons filtrados por tipo
    const [filteredTypeName, setFilteredTypeName] = useState(''); // Estado para almacenar el nombre del tipo seleccionado
    const [loading, setLoading] = useState(false); // Estado para seguimiento de la carga

    // Array con las URLs de las APIs
    const apiUrls = {
        digimons: 'https://digi-api.com/api/v1/digimon?pageSize=20',
        types: 'https://digi-api.com/api/v1/type',
    };
    
    // Cargar los Digimons generales
    useEffect(() => {
        setLoading(true);

        // Solicitar Digimons generales
        fetch(apiUrls.digimons)
            .then((response) => response.json())
            .then((data) => {
                setDigimons(data.content || []);
            })
            .catch((error) => {
                console.error('Error fetching Digimons:', error);
            })
            .finally(() => setLoading(false));
    }, []);

    // Cargar tipos de Digimons y filtrar aleatoriamente
    useEffect(() => {
        const fetchRandomPage = async () => {
            try {
                // Paso 1: Obtener el número total de páginas
                const initialResponse = await fetch(apiUrls.types);
                const initialData = await initialResponse.json();
                const totalPages = initialData.pageable.totalPages;
    
                // Paso 2: Seleccionar una página aleatoria
                const randomPage = Math.floor(Math.random() * totalPages);
    
                // Paso 3: Cargar tipos de la página aleatoria
                const response = await fetch(`${apiUrls.types}?page=${randomPage}`);
                const data = await response.json();
                const typesArray = data.content.fields.map((field) => ({
                    id: field.id,
                    name: field.name,
                }));
                setTypes(typesArray);
    
                 // Paso 4: Seleccionar un tipo aleatorio y cargar sus Digimons
                 if (typesArray.length > 0) {
                    const randomType = typesArray[Math.floor(Math.random() * typesArray.length)];
                    setFilteredTypeName(randomType.name); // Almacenar el nombre del tipo seleccionado
                    const typeResponse = await fetch(`${apiUrls.types}?name=${randomType.name}`);
                    const typeData = await typeResponse.json();
                    setFilteredDigimons(typeData.content || []);
                }
                } catch (error) {
                console.error('Error fetching random page:', error);
            }
        };
    
        fetchRandomPage();
    }, []);
    
    return (
        <div>
            {/*Llista inicial*/}
            <h2>Lista de Digimons</h2>
            {loading && <p>Cargando...</p>} {/* Mostrar mensaje de carga */}
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
                    !loading && <p>No se encontraron Digimons</p> // Si no se encuentran Digimons
                )}
            </div>
            {/*Llista Digimons filtrats*/}
            <h2>Digimons filtrats pel tipus: {filteredTypeName || 'Ninguno'}</h2>
            <div className="digimons-container">
                {filteredDigimons.length > 0 ? (
                        filteredDigimons.map((digimon) => (
                            <DigimonCard
                                key={digimon.id}
                                title={digimon.name}
                             //   imageUrl={digimon.image}
                            />
                        ))
                    ) : (
                        <p>No se encontraron Digimons filtrados</p>
                    )}
            </div>
        </div>
    );
}

export default DigimonsList;

