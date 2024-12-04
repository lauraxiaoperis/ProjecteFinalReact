import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DigimonCard from './DigimonCard'; 

function DigimonDetail(){
    const [digimonDetail, setDigimonDetail] = useState([]); // Estado para almacenar el Detalle del Digimon
    const { digimonId } = useParams(); // Obtiene el parámetro dinámico de la URL

    // =============== Fetch - Digimon Detail =============== 
    console.log(`Id: `+digimonId);
    useEffect(() => {
        fetch(`https://digi-api.com/api/v1/digimon/${digimonId}`)
            .then((response) => response.json())
            .then((data) => {
                setDigimonDetail(data || null);
             //   console.log('Data :', data);
            })
            .catch((error) => {
                console.error('Error fetching Digimon Details:', error);
            });
    }, [digimonId]); 
    useEffect(() => {
        console.log('Digimon Detail actualizado:', digimonDetail);
    }, [digimonDetail]);
    return(
        <div>
            <h2>Digimon Detail</h2>
            {digimonDetail ? (
                <div>
                    <h3>{digimonDetail.name}</h3> 
                </div>
            ) : (
                <p>There are no Digimons with this attribute.</p> 
            )}
        </div>
    );
}

export default DigimonDetail;