# Pokémon Pokedex
A full-stack web application featuring a Pokémon Pokedex built with Node.js, Express, GraphQL, and React.

## Features
- View a list of Pokémon with their details including name, type, and base stats.
- Sort Pokémon by ID, name, HP, attack, defense, special attack, special defense, and speed.
- Filter Pokémon by type.
- Paginate through the list of Pokémon.

## Technologies Used Server-side:
- Node.js
- Express.js
- GraphQL
- Cors

## Client-side:
- React
- React Router
- FontAwesome Icons

# Server-side Installation and Setup
1. Clone the repository:

```
git clone https://github.com/Twoos123/PokedexIkarus.git
cd PokexIkarus
```
2. Install dependencies:

```
npm install
```

(try npm install --force if encountering dependency issues)

3. Run the server:
```
node server/index.js
```
The server will start running at http://localhost:4000.

# Explore the endpoints:

1. GraphiQL Interface:

Explore and test GraphQL queries using the interactive GraphiQL tool at http://localhost:4000/graphql.

2. All Pokémon data endpoint: http://localhost:4000/api/pokemon

3. GraphQL Queries:
- pokemons: Get a list of all Pokémon.
- pokemon(id: Int!): Get details of a specific Pokémon by ID.
- Example query to fetch all Pokémon:

```{
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
````

# Client-side Installation and Setup

1. Navigate to the client directory:

```
cd client
```

2. Install dependencies:

```
npm install
```

3. Start the client app:

```
npm start
```

The React app will be running at http://localhost:3000.

## How to Use
 
Click on the column headers (ID, Name, HP, Attack, etc.) to sort Pokémon in ascending or descending order.
- Filtering: Use the dropdown to filter Pokémon by type.
- Pagination: Navigate through pages using the pagination buttons at the bottom.
- Detailed View: Click on the name of the Pokemon to get a detailed view.
