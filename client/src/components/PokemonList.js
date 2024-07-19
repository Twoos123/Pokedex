import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown } from '@fortawesome/free-solid-svg-icons';
import './PokemonList.css';

const PokemonList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [sortKey, setSortKey] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [filters, setFilters] = useState({ type: '' });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(100);

    useEffect(() => {
        const fetchData = async () => {
            const query = {
                query: `
                    {
                        pokemons {
                            id
                            name {
                                english
                            }
                            type
                            base {
                                HP
                                Attack
                                Defense
                                SpAttack
                                SpDefense
                                Speed
                            }
                        }
                    }
                `
            };

            try {
                const response = await fetch('http://localhost:4000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(query)
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const { data } = await response.json();
                setPokemons(data.pokemons);
                setFilteredPokemons(data.pokemons); 
            } catch (error) {
                console.error('Error fetching Pokémon data:', error);
            }
        };

        fetchData();
    }, []);

    const getSpriteUrl = (pokemonName) => {
        let formattedName = pokemonName.toLowerCase().replace(/♂/g, '-m')
            .replace(/♀/g, '-f')
            .replace(/\./g, '')
            .replace(/:/g, '')
            .replace(/'/g, '')
            .replace(/é/g, 'e')
            .replace(/ /g, '-');

        return `https://img.pokemondb.net/sprites/home/normal/${formattedName}.png`;
    };

    const handleSortChange = (key) => {
        if (sortKey === key) {
            setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    

        const sortedPokemons = [...filteredPokemons].sort((a, b) => {
            const valueA = getSortableValue(a, key);
            const valueB = getSortableValue(b, key);
    
            if (valueA < valueB) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (valueA > valueB) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    
        setFilteredPokemons(sortedPokemons);
    };

    const getSortableValue = useCallback((pokemon, key) => {
        if (key === 'total') return calculateTotal(pokemon.base);
        if (key === 'name') return pokemon.name.english.toLowerCase();
        if (key === 'SpAttack' || key === 'SpDefense') {
            return pokemon.base[key];
        }
        return pokemon.base[key] || pokemon.id;
    }, []);

    const calculateTotal = (base) => {
        return Object.values(base).reduce((acc, cur) => acc + cur, 0);
    };

    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
    };

    useEffect(() => {
        let filtered = pokemons.filter(pokemon => {
            const typeFilter = filters.type.toLowerCase();
            const matchesType = typeFilter === '' || pokemon.type.some(type => type.toLowerCase().includes(typeFilter));
            return matchesType;
        });

        setFilteredPokemons(filtered);
    }, [pokemons, filters]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPokemons = filteredPokemons.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            <h1>Pokémon Pokedex</h1>
            <div className="filters">
                <label>
                    Filter by Type:
                    <select onChange={(e) => handleFilterChange('type', e.target.value)}>
                        <option value="">All</option>
                        <option value="Normal">Normal</option>
                        <option value="Fire">Fire</option>
                        <option value="Water">Water</option>
                        <option value="Electric">Electric</option>
                        <option value="Grass">Grass</option>
                        <option value="Ice">Ice</option>
                        <option value="Fighting">Fighting</option>
                        <option value="Poison">Poison</option>
                        <option value="Ground">Ground</option>
                        <option value="Flying">Flying</option>
                        <option value="Psychic">Psychic</option>
                        <option value="Bug">Bug</option>
                        <option value="Rock">Rock</option>
                        <option value="Ghost">Ghost</option>
                        <option value="Dragon">Dragon</option>
                        <option value="Dark">Dark</option>
                        <option value="Steel">Steel</option>
                        <option value="Fairy">Fairy</option>
                    </select>
                </label>
            </div>
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSortChange('id')}>
                            #
                            {sortKey === 'id' && (
                                <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} className="sort-arrow" />
                            )}
                        </th>
                        <th onClick={() => handleSortChange('name')}>
                            Name
                            {sortKey === 'name' && (
                                <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} className="sort-arrow" />
                            )}
                        </th>
                        <th>Type</th>
                        <th onClick={() => handleSortChange('base.HP')}>
                            HP
                            {sortKey === 'base.HP' && (
                                <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} className="sort-arrow" />
                            )}
                        </th>
                        <th onClick={() => handleSortChange('base.Attack')}>
                            Attack
                            {sortKey === 'base.Attack' && (
                                <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} className="sort-arrow" />
                            )}
                        </th>
                        <th onClick={() => handleSortChange('base.Defense')}>
                            Defense
                            {sortKey === 'base.Defense' && (
                                <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} className="sort-arrow" />
                            )}
                        </th>
                        <th onClick={() => handleSortChange('base.SpAttack')}>
                            Sp. Atk
                            {sortKey === 'base.SpAttack' && (
                                <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} className="sort-arrow" />
                            )}
                        </th>
                        <th onClick={() => handleSortChange('base.SpDefense')}>
                            Sp. Def
                            {sortKey === 'base.SpDefense' && (
                                <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} className="sort-arrow" />
                            )}
                        </th>
                        <th onClick={() => handleSortChange('base.Speed')}>
                            Speed
                            {sortKey === 'base.Speed' && (
                                <FontAwesomeIcon icon={sortDirection === 'asc' ? faSortUp : faSortDown} className="sort-arrow" />
                            )}
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {currentPokemons.map(pokemon => (
                        <tr key={pokemon.id}>
                            <td>
                                <img src={getSpriteUrl(pokemon.name.english)} alt={pokemon.name.english} className='pokemon-sprite'/>
                                {pokemon.id}
                            </td>
                            <td>
                                <Link to={`/pokemon/${pokemon.id}`}>{pokemon.name.english}</Link>
                            </td>
                            <td>
                                {pokemon.type.map((type, index) => (
                                    <span key={index} className={`type ${type.toLowerCase()}`}>
                                        {type}
                                    </span>
                                ))}
                            </td>
                            <td>{pokemon.base.HP}</td>
                            <td>{pokemon.base.Attack}</td>
                            <td>{pokemon.base.Defense}</td>
                            <td>{pokemon.base.SpAttack}</td>
                            <td>{pokemon.base.SpDefense}</td>
                            <td>{pokemon.base.Speed}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
           
            <div className="pagination">
                {Array.from({ length: Math.ceil(filteredPokemons.length / itemsPerPage) }, (_, index) => (
                    <button key={index} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default PokemonList;
