import { rest } from 'msw';

export const handlers = [
  rest.get('https://pokeapi.co/api/v2/pokemon', (_req, res, ctx) => {
    return res(
      ctx.json({
        count: 1,
        results: [
          { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
        ],
      })
    );
  }),

  rest.get('https://pokeapi.co/api/v2/pokemon/:name', (_req, res, ctx) => {
    return res(
      ctx.json({
        id: 1,
        name: 'bulbasaur',
        sprites: {
          front_shiny: 'https://pokeapi.co/media/sprites/pokemon/shiny/1.png',
        },
        types: [{ type: { name: 'grass' } }],
        weight: 69,
        abilities: [{ ability: { name: 'overgrow' } }],
        height: 7,
      })
    );
  }),
];
