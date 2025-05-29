const express = require('express');
const { buildSchema } = require('graphql');
const { createHandler } = require('graphql-http/lib/use/express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000; // Vercel might set PORT

// Dynamic CORS origin
let corsOrigin = 'http://localhost:3000'; // Default for local client

if (process.env.VERCEL_ENV === 'production') {
  // IMPORTANT: Replace 'https://your-pokedex-prod-url.vercel.app' with your actual Vercel production domain
  // You will get this URL after your first successful production deployment.
  // For example: corsOrigin = 'https://pokedex-abc123xyz.vercel.app';
  corsOrigin = 'https://pokedex-sage-three.vercel.app';
} else if (process.env.VERCEL_URL) { // For Vercel preview deployments (e.g., branch deployments)
  corsOrigin = `https://${process.env.VERCEL_URL}`;
}
// Fallback if it's a Vercel environment but the above conditions didn't set a specific URL
// This allows any *.vercel.app domain, which is less secure but can be a temporary measure.
// It's better to set a specific production URL or use Vercel environment variables for the production origin.
else if (process.env.VERCEL) {
    corsOrigin = /vercel\.app$/;
}


app.use(cors({
  origin: corsOrigin,
  credentials: true,
}));

const filePath = path.join(__dirname, '../pokedata/pokedex.json');
const pokemonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

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

app.all('/graphql', createHandler({
  schema: schema,
  rootValue: root,
}));

app.get('/api/pokemon', (req, res) => {
  res.json(pokemonData);
});

// Only listen locally. Vercel handles starting the server in serverless functions.
if (!process.env.VERCEL) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log(`Access the array of all the Pokémon: http://localhost:${port}/api/pokemon`);
    console.log(`Open GraphQL endpoint (e.g., with a client tool): http://localhost:${port}/graphql`);
  });
}

module.exports = app; // Export the app for Vercel