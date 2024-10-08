import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSortUp, faSortDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import './PokemonList.css';

const PokemonList = () => {
    const [pokemons, setPokemons] = useState([]);
    const [filteredPokemons, setFilteredPokemons] = useState([]);
    const [sortKey, setSortKey] = useState('id');
    const [sortDirection, setSortDirection] = useState('asc');
    const [filters, setFilters] = useState({ types: [] });
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(100);
    const [searchTerm, setSearchTerm] = useState('');
    const [showScrollButton, setShowScrollButton] = useState(false);

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

    useEffect(() => {
        const handleScroll = () => {
            setShowScrollButton(window.scrollY > 100);
        };

        window.addEventListener('scroll', handleScroll);

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const getSpriteUrl = (pokemonName) => {
        let formattedName = pokemonName.toLowerCase()
            .replace(/♂/g, '-m')
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
        if (key.startsWith('base.')) {
            const baseKey = key.split('.')[1];
            return pokemon.base[baseKey];
        }
        return pokemon[key];
    }, []);

    const calculateTotal = (base) => {
        return Object.values(base).reduce((acc, cur) => acc + cur, 0);
    };

    const handleFilterChange = (value) => {
        setFilters(prevFilters => {
            const newTypes = prevFilters.types.includes(value)
                ? prevFilters.types.filter(type => type !== value)
                : [...prevFilters.types, value];
            
            return { types: newTypes };
        });
    };

    useEffect(() => {
        let filtered = pokemons.filter(pokemon => {
            const matchesType = filters.types.length === 0 || pokemon.type.some(type => filters.types.includes(type));
            return matchesType;
        });

        if (searchTerm.trim() !== '') {
            filtered = filtered.filter(pokemon =>
                pokemon.name.english.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredPokemons(filtered);
    }, [pokemons, filters, searchTerm]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentPokemons = filteredPokemons.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const pokemonTypes = [
        "Normal", "Fire", "Water", "Electric", "Grass", "Ice", "Fighting", "Poison",
        "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Dark",
        "Steel", "Fairy"
    ];

    return (
        <div>
            <h1>Pokémon Pokedex</h1>
            <div className="search-filter-container">
                <input
                    type="text"
                    placeholder="Search Pokémon..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
                <label className="filter-label">
                    Filter by Type:
                    <div className="filter-checkboxes">
                        {pokemonTypes.map((type) => (
                            <label key={type} className="checkbox-container">
                                <input
                                    type="checkbox"
                                    checked={filters.types.includes(type)}
                                    onChange={() => handleFilterChange(type)}
                                />
                                <span className="checkmark"></span>
                                {type}
                            </label>
                        ))}
                    </div>
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
                    <button key={index + 1} onClick={() => paginate(index + 1)} className={currentPage === index + 1 ? 'active' : ''}>
                        {index + 1}
                    </button>
                ))}
            </div>

            <div className="scroll-to-top">
                <button 
                    onClick={scrollToTop} 
                    className={`scroll-to-top-button ${showScrollButton ? 'show' : ''}`}>
                    <FontAwesomeIcon icon={faArrowUp} />
                </button>
            </div>
        </div>
    );
};

export default PokemonList;
