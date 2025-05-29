const express = require('express');
const { buildSchema } = require('graphql');
const { createHandler } = require('graphql-http'); // Standard import
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
// const PORT = process.env.PORT || 4000; // PORT is for local dev, Vercel handles it

// Dynamic CORS origin
let corsOrigin = 'http://localhost:3000'; // Default for local client

if (process.env.VERCEL_ENV === 'production') {
  // Ensure this is your correct Vercel production domain
  corsOrigin = 'https://pokedex-sage-three.vercel.app';
} else if (process.env.VERCEL_URL) { // For Vercel preview deployments
  corsOrigin = `https://${process.env.VERCEL_URL}`;
} else if (process.env.VERCEL) { // Fallback for other Vercel environments
  // This allows any *.vercel.app domain. For tighter security, consider if VERCEL_URL should always be present.
  const vercelAppRegex = /vercel\.app$/;
  if (typeof corsOrigin === 'string' && vercelAppRegex.test(corsOrigin)) {
    // If corsOrigin is already a vercel.app URL (e.g. from VERCEL_URL), do nothing
  } else {
    corsOrigin = vercelAppRegex;
  }
}

app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

// Load Pokémon data
const pokemonDataPath = path.join(__dirname, '../pokedata/pokedex.json');
const pokemonData = JSON.parse(fs.readFileSync(pokemonDataPath, 'utf8'));

// Define GraphQL schema
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

// Define resolvers
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

// Mount the GraphQL handler at the root of this function's Express app
// Since this file is api/graphql.js, requests to /api/graphql will hit this.
app.all('/', createHandler({
  schema: schema,
  rootValue: root,
}));

// Local development listener (Vercel handles this in deployment)
if (!process.env.VERCEL) {
  const localPort = process.env.PORT || 4000;
  app.listen(localPort, () => {
    console.log(`Server running locally at http://localhost:${localPort}`);
    console.log(`GraphQL endpoint available at http://localhost:${localPort}/`);
  });
}

module.exports = app; // Export the app for Vercel