import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './Detail.css';
import DigimonCard from './DigimonCard';  // Import the DigimonCard component

function DigimonDetail() {
    const [digimonDetail, setDigimonDetail] = useState([]); // State to store Digimon details
    const { digimonId } = useParams(); // Get the Digimon ID from the URL

    // =============== Fetch - Digimon Details ===============
    useEffect(() => {
        // Fetch Digimon details based on the ID
        fetch(`https://digi-api.com/api/v1/digimon/${digimonId}`)
            .then((response) => response.json())
            .then((data) => {
                setDigimonDetail(data || null); // Set the fetched data into state
            })
            .catch((error) => {
                console.error('Error fetching Digimon Details:', error); // Handle errors
            });
    }, [digimonId]); // Run this effect when the Digimon ID changes

    return (
        <div className='page-content-4'>
            {digimonDetail ? (
                <div id="digimon-card">
                    {/* Main Image of the Digimon */}
                    <div className='digimon-card-left'>
                        {digimonDetail.images?.[0] && (
                            <img 
                                src={digimonDetail.images[0].href} // Image source
                                alt={digimonDetail.name} // Alt text for the image
                            />
                        )}
                    </div>

                    {/* General Information */}
                    <div className='digimon-card-right'>
                        <h2 className='digimon-name'>{digimonDetail.name}</h2> {/* Digimon Name */}
                        {digimonDetail.descriptions?.[1] && (
                            <p className='digimon-description'>
                                {digimonDetail.descriptions[1].description} {/* Description of the Digimon */}
                            </p>
                        )}
                        <div className='digimon-stats'>
                            <p><strong>LEVEL:</strong> {digimonDetail.levels?.[0]?.level || 'Unknown'}</p> {/* Digimon Level */}
                            <p><strong>TYPE:</strong> {digimonDetail.types?.[0]?.type || 'Unknown'}</p> {/* Digimon Type */}
                            <p><strong>ATTRIBUTES:</strong> {digimonDetail.attributes?.map(attr => attr.attribute).join(', ') || 'None'}</p> {/* Digimon Attributes */}
                        </div>
                    </div>

                     {/* Fields Section */}
                     {digimonDetail.fields?.length > 0 && (
                        <div className='digimon-fields'>
                            <h4>FIELDS</h4> {/* Section title */}
                            <div className='fieldss'>
                                {digimonDetail.fields.map((field, index) => (
                                    <div key={index} className='field-card'>
                                        <img src={field.image} alt={field.field} className="field-image" /> {/* Field Image */}
                                        <p>{field.field}</p> {/* Field Name */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    
                    {/* Skills Section */}
                    {digimonDetail.skills?.length > 0 && (
                        <div className='digimon-skills'>
                            <h4>SKILLS</h4> {/* Section title */}
                            <div className='skills-container'>
                                {digimonDetail.skills.map((skill, index) => (
                                    <div key={index} className='skill-card'>
                                        <p><strong>{skill.skill}</strong></p> {/* Skill Name */}
                                        <p>{skill.description}</p> {/* Skill Description */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Prior Evolutions Section */}
                    {digimonDetail.priorEvolutions?.length > 0 && (
                        <div className='digimon-evolutions'>
                            <h4>Prior Evolutions</h4> {/* Section title */}
                            <div className='digimons-container'>
                                {digimonDetail.priorEvolutions.slice(0, 5).map((evolution, index) => (
                                    <Link key={index} to={`/digimon/${evolution.id}`}> {/* Link to the details */}
                                        <DigimonCard
                                            title={evolution.digimon} 
                                            imageUrl={evolution.image} 
                                            additionalClass="card-evolution"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Next Evolutions Section */}
                    {digimonDetail.nextEvolutions?.length > 0 && (
                        <div className='digimon-evolutions'>
                            <h4>Next Evolutions</h4> {/* Section title */}
                            <div className='digimons-container'>
                                {digimonDetail.nextEvolutions.slice(0, 5).map((evolution, index) => (
                                    <Link key={index} to={`/digimon/${evolution.id}`}> {/* Link to the details */}
                                        <DigimonCard
                                            title={evolution.digimon} 
                                            imageUrl={evolution.image} 
                                            additionalClass="card-evolution"
                                        />
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p>No details available for this Digimon.</p> // If no details found
            )}
        </div>
    );
}

export default DigimonDetail;


