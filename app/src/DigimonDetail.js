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

    // =============== Print =============== 
    return(
        <div>
            {digimonDetail ? (
                <div>
                    <h3>{digimonDetail.name}</h3>
                    {digimonDetail.descriptions?.[1] && (
                        <p>{digimonDetail.descriptions[1].description}</p>
                    )}
                    {digimonDetail.images?.[0] && ( //? comprova si existeix el primer element de images
                        <img
                            src={digimonDetail.images[0].href}
                            alt={digimonDetail.name}
                        />
                    )}
                    {digimonDetail.levels?.[0] && (
                        <p>Level: {digimonDetail.levels[0].level}</p>
                    )}
                    {digimonDetail.types?.[0] && (
                        <p>Type: {digimonDetail.types[0].type}</p>
                    )}
                    {digimonDetail.attributes?.length > 0 && (
                        <p>Attributes: {digimonDetail.attributes.map(attribute => attribute.attribute).join(', ')}</p> 
                    )}
                    {digimonDetail.fields?.length > 0 && (
                        <div>
                            <p>Field:</p>
                            {digimonDetail.fields.map((item, index) => (
                                <div key={index}>
                                    <img
                                        src={item.image}
                                        alt={item.field}
                                    />
                                    <span>{item.field}</span>
                                </div>
                            ))}
                        </div>
                    )}
                    {digimonDetail.skills?.[0] && (
                        <div>
                            <p>skills:</p>
                            {digimonDetail.skills.map((item, index) => (
                                <div key={index}>
                                    <p><strong>{item.skill}</strong> : {item.description}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            ) : (
                <p>There are no Details in this Digimon.</p> 
            )}
        </div>
    );
}

export default DigimonDetail;