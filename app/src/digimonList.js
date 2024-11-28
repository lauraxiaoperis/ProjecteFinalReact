import React, { useState, useEffect } from 'react';
import DigimonCard from './DigimonCard'; 
import './App.css';

function DigimonsList() {
    const [digimons, setDigimons] = useState([]); // Estado para almacenar los Digimons
    const [loading, setLoading] = useState(false); // Estado para rastrear si los datos están cargando

    useEffect(() => {
        setLoading(true); // Iniciar la carga de datos

        // Realizar la solicitud a la API con el parámetro pageSize=20
        fetch('https://digi-api.com/api/v1/digimon?pageSize=20')
            .then((response) => response.json()) // Parsear la respuesta a JSON
            .then((data) => {
                setDigimons(data.content || []); // Guardar los Digimons en el estado
            })
            .catch((error) => {
                console.error('Error fetching Digimons:', error);
            })
            .finally(() => setLoading(false)); // Finalizar la carga de datos
    }, []); // Este efecto se ejecuta solo una vez al montar el componente

    return (
        <div>
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
        </div>
    );
}

export default DigimonsList;

