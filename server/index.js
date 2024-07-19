const express = require('express');
const { buildSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
}));

const filePath = path.join(__dirname, '../pokedata/pokedex.json');
const pokemonData = JSON.parse(fs.readFileSync(filePath));

const schema = buildSchema(`
  type Query {
    pokemons: [Pokemon]
    pokemon(id: Int!): Pokemon
  }
  
  type Pokemon {
    id: Int
    name: Name
    type: [String]
    base: Base
  }
  
  type Name {
    english: String
    japanese: String
    chinese: String
    french: String
  }
  
  type Base {
    HP: Int
    Attack: Int
    Defense: Int
    SpAttack: Int
    SpDefense: Int
    Speed: Int
  }
`);

const root = {
  pokemons: () => {
    return pokemonData.map(pokemon => ({
      ...pokemon,
      base: {
        HP: pokemon.base.HP,
        Attack: pokemon.base.Attack,
        Defense: pokemon.base.Defense,
        SpAttack: pokemon.base["Sp. Attack"],
        SpDefense: pokemon.base["Sp. Defense"],
        Speed: pokemon.base.Speed,
      }
    }));
  },
  pokemon: ({ id }) => {
    const pokemon = pokemonData.find(p => p.id === id);
    if (!pokemon) return null;
    return {
      ...pokemon,
      base: {
        HP: pokemon.base.HP,
        Attack: pokemon.base.Attack,
        Defense: pokemon.base.Defense,
        SpAttack: pokemon.base["Sp. Attack"],
        SpDefense: pokemon.base["Sp. Defense"],
        Speed: pokemon.base.Speed,
      }
    };
  },
};

app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true, 
}));

app.get('/api/pokemon', (req, res) => {
  res.json(pokemonData);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Access the array of all the Pokémon: http://localhost:${port}/api/pokemon`);
  console.log(`Open GraphiQL tool: http://localhost:${port}/graphql`);
});
