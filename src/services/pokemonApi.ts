import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { PokemonsDto } from '../interfaces/pokemons-dto';
import { Result, SearchResults } from '../interfaces/results';

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://pokeapi.co/api/v2/' }),
  endpoints: (builder) => ({
    getAllPokemons: builder.query({
      query: ({ limit, offset }) => `pokemon?limit=${limit}&offset=${offset}`,
      transformResponse: (response: SearchResults) => {
        const pokemons = response.results.map(async (pokemon: PokemonsDto) => {
          const pokemonResponse = await fetch(pokemon.url);
          const pokemonData = await pokemonResponse.json();
          return {
            id: pokemonData.id,
            name: pokemonData.name,
            image: pokemonData.sprites.front_default,
            types: pokemonData.types,
            weight: pokemonData.weight,
            abilities: pokemonData.abilities,
            height: pokemonData.height,
            back_view: pokemonData.sprites.back_shiny,
          };
        });
        return Promise.all(pokemons).then((pokemonsData) => ({
          count: response.count,
          results: pokemonsData,
        }));
      },
    }),
    getPokemonByName: builder.query({
      query: (name) => `pokemon/${name}`,
      transformResponse: (response: Result) => ({
        id: response.id,
        name: response.name,
        image: response.sprites?.front_shiny,
        types: response.types,
        weight: response.weight,
        abilities: response.abilities,
        height: response.height,
        back_view: response.sprites?.back_shiny,
      }),
    }),
  }),
});

export const { useGetAllPokemonsQuery, useGetPokemonByNameQuery } = pokemonApi;
