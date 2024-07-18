import React, { useState } from 'react';

function Search({ onSearch }) {
  const [term, setTerm] = useState('');

  const handleChange = (event) => {
    setTerm(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onSearch(term);
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Search Pokémon"
        value={term}
        onChange={handleChange}
      />
      <button type="submit">Search</button>
    </form>
  );
}

export default Search;