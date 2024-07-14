import { PokemonsDto } from '../interfaces/pokemons-dto';
import { Result } from '../interfaces/results';

const API_URL = 'https://pokeapi.co/api/v2/pokemon';

export const fetchPokemons = async (limit: number, offset: number) => {
  const response = await fetch(`${API_URL}/?limit=${limit}&offset=${offset}`);
  const data = await response.json();
  const pokemons = data.results;

  const detailedPokemons = await Promise.all(
    pokemons.map(async (pokemon: PokemonsDto) => {
      const details = await fetch(pokemon.url);
      const detailsData = await details.json();
      return extractPokemonData(detailsData);
    })
  );
  return { results: detailedPokemons, count: data.count };
};

export const fetchByName = async (name: string | number) => {
  if (!name) {
    return fetchPokemons(100, 0);
  }
  const response = await fetch(`${API_URL}/${name}`);
  if (!response.ok) {
    throw new Error(`Pokemon not found: ${name}`);
  }
  const data = await response.json();
  return [extractPokemonData(data)];
};

const extractPokemonData = (data: Result) => ({
  id: data.id,
  name: data.name,
  weight: data.weight,
  abilities: data.abilities,
  height: data.height,
  types: data.types,
  image: data.sprites.front_shiny,
  back_view: data.sprites.back_shiny,
});
