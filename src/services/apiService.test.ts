import { fetchByName } from '../services/apiService';
import fetchMock from 'jest-fetch-mock';
import fetch, { enableFetchMocks } from 'jest-fetch-mock';

enableFetchMocks();

beforeEach(() => {
  fetchMock.resetMocks();
});

test('fetchPokemonByName fetches pokemon by name correctly', async () => {
  const pokemonDetails = {
    name: 'pokemon 1',
    sprites: {
      front_shiny: 'shiny1',
      back_shiny: 'shiny2',
    },
  };
  fetchMock.mockResponseOnce(JSON.stringify(pokemonDetails));

  await fetchByName('bulbasaur');

  expect(fetch).toHaveBeenCalledTimes(1);
});

test('fetchByName fetches all pokemons when name is empty', async () => {
  const mockPokemons = [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
  ];

  const mockPokemonDetails = {
    id: 1,
    name: 'bulbasaur',
    weight: 69,
    height: 7,
    abilities: [],
    types: [],
    sprites: { front_shiny: 'shiny1', back_shiny: 'shiny2' },
  };

  fetchMock.mockResponses(
    [JSON.stringify({ results: mockPokemons, count: 1 }), { status: 200 }],
    [JSON.stringify(mockPokemonDetails), { status: 200 }]
  );

  const result = await fetchByName('');

  expect(fetch).toHaveBeenCalledTimes(2);
  expect(result).toEqual({
    results: [
      {
        id: 1,
        name: 'bulbasaur',
        weight: 69,
        height: 7,
        abilities: [],
        types: [],
        image: 'shiny1',
        back_view: 'shiny2',
      },
    ],
    count: 1,
  });
});
