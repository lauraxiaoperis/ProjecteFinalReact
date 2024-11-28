import React from 'react';
import './App.css'; // Importa los estilos

function DigimonCard({ title, imageUrl }) {
    return (
        <div className="digimon-card">
            <img src={imageUrl} alt={title} />
            <div className="digimon-title">{title}</div>
        </div>
    );
}

export default DigimonCard;

