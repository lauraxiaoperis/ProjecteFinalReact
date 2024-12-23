import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import DigimonCard from './DigimonCard'; 
import DigimonContext from './DigimonContext';  // Import the context
import './App.css';

function DigimonsList() {
    const [digimons, setDigimons] = useState([]); // State to store all Digimons
    const [filteredDigimons, setFilteredDigimons] = useState([]); // State to store filtered Digimons by attribute
    const [currentPage, setCurrentPage] = useState(0); // Current page of the general list
    const [totalPages, setTotalPages] = useState(0); // Total pages of the general list
    const [randomAttribute, setRandomAttribute] = useState(''); // Random attribute

    const { filteredAttributeName } = useContext(DigimonContext); // Access the context only for attributes

    const numberDigimons = 18;

    // =============== Fetch - General - Digimon List (Pagination) =============== 
    useEffect(() => {
        // Request general Digimons based on the current page
        fetch(`https://digi-api.com/api/v1/digimon?pageSize=${numberDigimons}&page=${currentPage}`)
            .then((response) => response.json())
            .then((data) => {
                setDigimons(data.content || []);
                setTotalPages(data.pageable.totalPages || 1);
            })
            .catch((error) => {
                console.error('Error fetching Digimons:', error);
            });
    }, [currentPage]); // Only re-run when the current page changes
    
    // =============== Fetch - Digimon List - Random Attribute  =============== 
    useEffect(() => {
        if (filteredAttributeName.length > 0) {
            // Random Attribute
            const ranAttribute = filteredAttributeName[Math.floor(Math.random() * filteredAttributeName.length)];
            setRandomAttribute(ranAttribute);
    
            // Fetch Digimons based on the attribute
            fetch(`https://digi-api.com/api/v1/digimon?attribute=${ranAttribute}&&pageSize=6`)
                .then((response) => response.json())
                .then((data) => {
                    setFilteredDigimons(data.content || []);
                })
                .catch((error) => {
                    console.error('Error fetching Random Digimons List:', error);
                });
        }
    }, [filteredAttributeName]); // Re-run when the attribute changes

    // Function to handle navigation between pages of the general list
    const goToPage = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber < totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Render pagination buttons for pages 5 at a time (including previous/next)
    const renderPageButtons = () => {
        let pages = [];
        const leftBound = Math.max(currentPage - 2, 0); // Ensure we don't go below 0
        const rightBound = Math.min(currentPage + 2, totalPages - 1); // Ensure we don't exceed totalPages
        
        for (let i = leftBound; i <= rightBound; i++) {
            pages.push(i);
        }
        
        return pages.map((page) => (
            <button 
                key={page}
                onClick={() => goToPage(page)} 
                className={page === currentPage ? 'active' : ''}
            >
                {page + 1}
            </button>
        ));
    };

    return (
        <div>            
            <div className="parallax-background"></div> 
            {/*  =============== General Digimon List ===============  */}
            <div className="digimons-container">
                {digimons.length > 0 ? (
                    // If there are Digimons, map and display the cards
                    digimons.map((digimon) => (
                        <Link key={digimon.id} to={`/digimon/${digimon.id}`}>  {/* Link to the details */}
                            <DigimonCard
                                key={digimon.id} 
                                title={digimon.name} 
                                imageUrl={digimon.image} 
                            />
                        </Link>
                    ))
                ) : (
                    <p>No Digimons found</p> // If no Digimons are found
                )}
            </div>

            {/* Pagination - Only affects the general list */}
            <div className="pagination">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 0}>Previous</button>
                {renderPageButtons()}
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages - 1}>Next</button>
            </div>

            {/* =============== Random Attribute - Digimon List =============== */}
            <h2>Digimons filtered by attribute: {randomAttribute || 'None'}</h2>
            <div className="digimons-container">
                {filteredDigimons.length > 0 ? (
                    filteredDigimons.map((digimon) => (
                        <Link key={digimon.id} to={`/digimon/${digimon.id}`}>  {/* Link to the details */}
                            <DigimonCard
                                key={digimon.id} 
                                title={digimon.name} 
                                imageUrl={digimon.image} 
                            />
                        </Link>
                    ))
                ) : (
                    <p>No Digimons found with this attribute.</p> 
                )}
            </div>
        </div>
    );
}

export default DigimonsList;

