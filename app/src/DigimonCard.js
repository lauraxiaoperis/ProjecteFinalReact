import React from 'react';
import './App.css'; // Import styles

function DigimonCard({ title, imageUrl, additionalClass }) {
    return (
        <div className={`digimon-card ${additionalClass || ''}`}>
            <img src={imageUrl} alt={title} />
            <div className="digimon-title">{title}</div>
        </div>
    );
}

export default DigimonCard;


