import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const PokemonList = () => {
    const [pokemons, setPokemons] = useState([]);

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
            } catch (error) {
                console.error('Error fetching Pokémon data:', error);
            }
        };

        fetchData();
    }, []);

    return (
        <div>
            <h1>
                Pokémon Pokedex
            </h1>
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Type</th>
                        <th>HP</th>
                        <th>Attack</th>
                        <th>Defense</th>
                        <th>Sp. Atk</th>
                        <th>Sp. Def</th>
                        <th>Speed</th>
                    </tr>
                </thead>
                <tbody>
                    {pokemons.map(pokemon => (
                        <tr key={pokemon.id}>
                            <td>
                                <img src={`https://img.pokemondb.net/sprites/black-white/anim/normal/${pokemon.name.english.toLowerCase()}.gif`} alt={pokemon.name.english} />
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
        </div>
    );
};

export default PokemonList;
