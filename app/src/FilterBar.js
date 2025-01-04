import React, { useContext, useState } from 'react';
import DigimonContext from './DigimonContext';
import './App.css';
import './FilterBar.css';

/**
 * FilterBar component - reusable filter bar for searching Digimons.
 * Props:
 *   - onSearch: Function to handle search based on filter values.
 */
function FilterBar({ onSearch }) {
    // State for filters
    const [name, setName] = useState(''); // Stores the name entered by the user
    const [selectedAttribute, setSelectedAttribute] = useState(''); // Stores the selected attribute
    const [xAntibody, setXAntibody] = useState(false); // Stores the checkbox state (true or false)
    const [selectedLevel, setSelectedLevel] = useState(''); // Stores the selected level

    // Use context to get both attributes and levels
    const { filteredAttributeName, levels } = useContext(DigimonContext);

    /**
     * handleSearch - Invokes the onSearch function with current filter values.
     * This function sends the current filter state back to the parent component.
     * (the parent is Search.js or DigimonTeam.js)
     */
    const handleSearch = () => {
        onSearch({ name, selectedAttribute, xAntibody, selectedLevel });
    };

    return (
        <div className="filter-container">
            {/* Name filter input */}
            <div className="filter">
                <label htmlFor="name">NAME</label>
                <input
                    type="text"
                    id="name"
                    value={name}
                    // Updates the name state on input change
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter Digimon name"
                />
            </div>

            {/* Filter by attribute */}
            <div className="filter">
                <label htmlFor="attribute">ATTRIBUTE ✴︎</label>
                {/* Dropdown menu for the user to select an attribute */}
                <select
                    id="attribute"
                    value={selectedAttribute}
                    onChange={(e) => setSelectedAttribute(e.target.value)} // Updates selected attribute
                >
                    <option value="">All</option>
                    {filteredAttributeName.map((attr) => (
                        <option key={attr} value={attr}>
                            {attr} {/* Render attribute options */}
                        </option>
                    ))}
                </select>
            </div>

            {/* Filter by xAntibody */}
            <div className="filter">
                <label>
                    <input
                        type="checkbox"
                        checked={xAntibody}
                        // When the checkbox state changes, update the "xAntibody" state
                        onChange={(e) => setXAntibody(e.target.checked)}
                    />
                    xAntibody 
                </label>
            </div>

            {/* Filter by level */}
             {/* Similar to the attribute filter but uses the list fetched from the API */}
            <div className="filter">
                <label htmlFor="level">LEVEL ⚔</label>
                <select
                    id="level"
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                >
                    <option value="">All</option>
                    {levels.map((lvl) => (
                        <option key={lvl} value={lvl}>
                            {lvl} 
                        </option>
                    ))}
                </select>
            </div>

            {/* Button to trigger the handleSearch function */}
            <button onClick={handleSearch}>Search</button>
        </div>
    );
}

export default FilterBar;