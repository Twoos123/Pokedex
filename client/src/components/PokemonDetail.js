import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './PokemonDetail.css';

const PokemonDetail = () => {
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPokemonDetails = async () => {
            setLoading(true);
            setError(null);
            const query = JSON.stringify({
                query: `{
                    pokemon(id: ${parseInt(id, 10)}) {
                        id
                        name {
                            english
                            japanese
                            chinese
                            french
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
                }`,
            });

            try {
                // MODIFIED: Changed fetch URL to relative path for Vercel
                const response = await fetch('/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: query,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.errors ? errorData.errors[0].message : 'Failed to fetch data');
                }

                const responseData = await response.json();
                if (responseData.errors) {
                    throw new Error(responseData.errors[0].message);
                }
                setPokemon(responseData.data.pokemon);
                setLoading(false);
                window.scrollTo(0, 0);
            } catch (error) {
                console.error('Error fetching Pokémon details:', error);
                setError(`Failed to fetch Pokémon details: ${error.message}. Please try again later.`);
                setLoading(false);
            }
        };

        fetchPokemonDetails();
    }, [id]);

    const goToNextPokemon = () => {
        const currentId = parseInt(id, 10);
        const nextPokemonId = currentId >= 809 ? 1 : currentId + 1; // Assuming 809 is max ID
        navigate(`/pokemon/${nextPokemonId}`);
    };

    const goToPreviousPokemon = () => {
        const currentId = parseInt(id, 10);
        const previousPokemonId = currentId <= 1 ? 809 : currentId - 1; // Assuming 1 is min ID
        navigate(`/pokemon/${previousPokemonId}`);
    };

    const goToPokemonTable = () => {
        navigate('/');
    };

    const getSpriteUrl = (pokemonName) => {
        if (!pokemonName) return '';
        let formattedName = pokemonName.toLowerCase().replace(/♂/g, '-m')
            .replace(/♀/g, '-f')
            .replace(/\./g, '')
            .replace(/:/g, '')
            .replace(/'/g, '')
            .replace(/é/g, 'e')
            .replace(/ /g, '-');

        return `https://img.pokemondb.net/sprites/home/normal/${formattedName}.png`;
    };

    const renderStatBar = (statName, value) => {
        const maxStatValue = 255; // Typical max for a single stat
        const barWidth = Math.min((value / maxStatValue) * 100, 100); // Cap at 100%
    
        return (
            <div className="stat-bar">
                <span className="stat-label">{statName}</span>
                <div className="bar-container">
                    <div className="bar" style={{ width: `${barWidth}%` }}></div>
                </div>
                <span className="stat-value">{value}</span>
            </div>
        );
    };

    if (loading) return <div className="pokemon-card">Loading...</div>;
    if (error) return <div className="pokemon-card">{error}</div>;
    if (!pokemon) return <div className="pokemon-card">Pokémon not found.</div>;

    return (
        <div className="pokemon-card">
            <div className="title-row">
                <button className="nav-button" onClick={goToPreviousPokemon}>Previous Pokémon</button>
                <h2 className="pokemon-name">{pokemon.name.english}</h2>
                <button className="nav-button" onClick={goToNextPokemon}>Next Pokémon</button>
            </div>
            <div className="center">
                <div className="center-left">
                    <img className="pokemon-image" src={getSpriteUrl(pokemon.name.english)} alt={pokemon.name.english} />
                </div>
                <div className="center-right">
                    <p className="pokemon-number">ID: {pokemon.id}</p>
                    <div className="pokemon-types">
                        {pokemon.type.map((type, index) => (
                            <span key={index} className={`type ${type.toLowerCase()}`}>
                                {type}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="stats-container">
                <div className="stats-left">
                    <h3 className="stats-left-title">Base Stats:</h3>
                    {renderStatBar('HP', pokemon.base.HP)}
                    {renderStatBar('Attack', pokemon.base.Attack)}
                    {renderStatBar('Defense', pokemon.base.Defense)}
                    {renderStatBar('Sp. Attack', pokemon.base.SpAttack)}
                    {renderStatBar('Sp. Def', pokemon.base.SpDefense)}
                    {renderStatBar('Speed', pokemon.base.Speed)}
                </div>
                <div className="stats-right">
                    <h3 className="stats-right-title">Name in different languages:</h3>
                    <p>Japanese: {pokemon.name.japanese}</p>
                    <p>Chinese: {pokemon.name.chinese}</p>
                    <p>French: {pokemon.name.french}</p>
                </div>
            </div>
            <div className="back-button-container">
                <button className="back-button" onClick={goToPokemonTable}>Back to Pokémon List</button>
            </div>
        </div>
    );
};

export default PokemonDetail;