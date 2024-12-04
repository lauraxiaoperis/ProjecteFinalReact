import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function DigimonDetail(){
    const { digimonId } = useParams(); // Obtiene el parámetro dinámico de la URL
    return(
        <div>Digimon Detail</div>
    );
}

export default DigimonDetail;