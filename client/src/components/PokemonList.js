import React, { useEffect, useState } from 'react';
import Search from './Search';

function PokemonList() {
  const [pokemons, setPokemons] = useState([]);
  const [filteredPokemons, setFilteredPokemons] = useState([]);

  useEffect(() => {
    fetch('http://localhost:4000/api/pokemon')
      .then((response) => response.json())
      .then((data) => {
        setPokemons(data);
        setFilteredPokemons(data);
      });
  }, []);

  const handleSearch = (term) => {
    const lowerCaseTerm = term.toLowerCase();
    const filtered = pokemons.filter((pokemon) =>
      pokemon.name.english.toLowerCase().includes(lowerCaseTerm)
    );
    setFilteredPokemons(filtered);
  };

  return (
    <div>
      <Search onSearch={handleSearch} />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>HP</th>
            <th>Attack</th>
            <th>Defense</th>
            <th>Sp. Attack</th>
            <th>Sp. Defense</th>
            <th>Speed</th>
          </tr>
        </thead>
        <tbody>
          {filteredPokemons.map((pokemon) => (
            <tr key={pokemon.id}>
              <td>{pokemon.name.english}</td>
              <td>{pokemon.type.join(', ')}</td>
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
}

export default PokemonList;
