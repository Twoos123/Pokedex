import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function PokemonDetail() {
  const { name } = useParams();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    fetch(`/api/pokemons/${name}`)
      .then(response => response.json())
      .then(data => setPokemon(data));
  }, [name]);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{pokemon.name.english}</h1>
      <img src={`https://img.pokemondb.net/artwork/${pokemon.name.english.toLowerCase()}.jpg`} alt={pokemon.name.english} />
      <p>Type: {pokemon.type.join(', ')}</p>
      <p>HP: {pokemon.base.HP}</p>
      <p>Weight: {pokemon.weight}</p>
      <p>Abilities: {pokemon.abilities.join(', ')}</p>
      {/* Add more details as needed */}
    </div>
  );
}

export default PokemonDetail;