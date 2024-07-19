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
            const query = JSON.stringify({
                query: `{
                    pokemon(id: ${id}) {
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
                const response = await fetch('http://localhost:4000/graphql', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: query,
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }

                const data = await response.json();
                setPokemon(data.data.pokemon);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching Pokémon details:', error);
                setError('Failed to fetch Pokémon details. Please try again later.');
                setLoading(false);
            }
        };

        fetchPokemonDetails();
    }, [id]);

    const goToNextPokemon = () => {
        const nextPokemonId = parseInt(id) === 809 ? 1 : parseInt(id) + 1;
        navigate(`/pokemon/${nextPokemonId}`);
    };

    const goToPreviousPokemon = () => {
        const previousPokemonId = parseInt(id) === 1 ? 809 : parseInt(id) - 1;
        navigate(`/pokemon/${previousPokemonId}`);
    };

    const goToPokemonTable = () => {
        navigate('/');
    };

    if (loading) return <div className="pokemon-card">Loading...</div>;
    if (error) return <div className="pokemon-card">{error}</div>;
    if (!pokemon) return null;

    return (
        <div className="pokemon-card">
            <div className="title-row">
                <button className="nav-button" onClick={goToPreviousPokemon}>Previous Pokemon</button>
                <h2 className="pokemon-name">{pokemon.name.english}</h2>
                <button className="nav-button" onClick={goToNextPokemon}>Next Pokemon</button>
            </div>
            <div className="center">
                <div className="center-left">
                    <img className="pokemon-image" src={`https://img.pokemondb.net/artwork/${pokemon.name.english.toLowerCase()}.jpg`} alt={pokemon.name.english} />
                </div>
                <div className="center-right">
                    <p className="pokemon-number">ID: {pokemon.id}</p>
                    <div className="pokemon-types">
                        {pokemon.type.map((type, index) => (
                            <span key={index} className="type">Type: {type}</span>
                        ))}
                    </div>
                </div>
            </div>
            <div className="stats-container">
                <div className="stats-left">
                    <h3 className="stats-left-title">Base Stats:</h3>
                    <p>HP: {pokemon.base.HP}</p>
                    <p>Attack: {pokemon.base.Attack}</p>
                    <p>Defense: {pokemon.base.Defense}</p>
                    <p>Sp. Attack: {pokemon.base.SpAttack}</p>
                    <p>Sp. Defense: {pokemon.base.SpDefense}</p>
                    <p>Speed: {pokemon.base.Speed}</p>
                </div>
                <div className="stats-right">
                    <h3 className="stats-right-title">Name in different languages:</h3>
                    <p>Japanese: {pokemon.name.japanese}</p>
                    <p>Chinese: {pokemon.name.chinese}</p>
                    <p>French: {pokemon.name.french}</p>
                </div>
            </div>
            <div className="back-button-container">
                <button className="back-button" onClick={goToPokemonTable}>Back to Pokemon List</button>
            </div>
        </div>
    );
};

export default PokemonDetail;
