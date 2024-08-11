import { fetchByName, fetchPokemons } from './apiService';

describe('fetchByName', () => {
  it('should fetch the pokemon details by name', async () => {
    const mockPokemon = {
      id: 1,
      name: 'bulbasaur',
      weight: 69,
      abilities: [
        { ability: { name: 'overgrow', url: 'http://example.com/overgrow' } },
      ],
      height: 7,
      types: [{ type: { name: 'grass', url: 'http://example.com/grass' } }],
      sprites: {
        front_shiny: 'http://example.com/front.png',
        back_shiny: 'http://example.com/back.png',
      },
    };

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockPokemon),
      })
    ) as jest.Mock;

    const result = await fetchByName('bulbasaur');

    expect(fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/bulbasaur'
    );
    expect(result).toEqual([
      {
        id: mockPokemon.id,
        name: mockPokemon.name,
        weight: mockPokemon.weight,
        abilities: mockPokemon.abilities,
        height: mockPokemon.height,
        types: mockPokemon.types,
        image: mockPokemon.sprites.front_shiny,
        back_view: mockPokemon.sprites.back_shiny,
      },
    ]);

    // Очистка моков после теста
    (fetch as jest.Mock).mockClear();
  });
});

describe('fetchPokemons', () => {
  beforeEach(() => {
    const mockResponse = {
      results: [
        { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
      ],
      count: 2,
    };

    const mockDetails = {
      id: 1,
      name: 'bulbasaur',
      weight: 69,
      abilities: [],
      height: 7,
      types: [],
      sprites: {
        front_shiny: 'http://example.com/front.png',
        back_shiny: 'http://example.com/back.png',
      },
    };

    global.fetch = jest
      .fn()
      .mockImplementationOnce(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve(mockResponse) })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve(mockDetails) })
      )
      .mockImplementationOnce(() =>
        Promise.resolve({ ok: true, json: () => Promise.resolve(mockDetails) })
      );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should fetch and return pokemons with detailed information', async () => {
    const limit = 2;
    const offset = 0;

    const result = await fetchPokemons(limit, offset);

    expect(fetch).toHaveBeenCalledTimes(3);
    expect(fetch).toHaveBeenCalledWith(
      'https://pokeapi.co/api/v2/pokemon/?limit=2&offset=0'
    );
    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/1/');
    expect(fetch).toHaveBeenCalledWith('https://pokeapi.co/api/v2/pokemon/2/');
    expect(result).toEqual({
      results: [
        {
          id: 1,
          name: 'bulbasaur',
          weight: 69,
          abilities: [],
          height: 7,
          types: [],
          image: 'http://example.com/front.png',
          back_view: 'http://example.com/back.png',
        },
        {
          id: 1,
          name: 'bulbasaur',
          weight: 69,
          abilities: [],
          height: 7,
          types: [],
          image: 'http://example.com/front.png',
          back_view: 'http://example.com/back.png',
        },
      ],
      count: 2,
    });
  });
});
