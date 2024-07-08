import { PokemonsDto } from '../interfaces/pokemons-dto'
import { Result } from '../interfaces/results'

const API_URL = 'https://pokeapi.co/api/v2/pokemon'

export const fetchPokemons = async () => {
  const response = await fetch(API_URL)
  const data = await response.json()
  const pokemons = data.results

  const detailedPokemons = await Promise.all(
    pokemons.map(async (pokemon: PokemonsDto) => {
      const details = await fetch(pokemon.url)
      const detailsData = await details.json()
      return extractPokemonData(detailsData)
    })
  )
  return detailedPokemons
}

export const fetchByName = async (name: string) => {
  if (!name) {
    return fetchPokemons()
  }
  const response = await fetch(`${API_URL}/${name}`)
  const data = await response.json()
  return [extractPokemonData(data)]
}

const extractPokemonData = (data: Result) => ({
  id: data.id,
  name: data.name,
  weight: data.weight,
  abilities: data.abilities,
  height: data.height,
  types: data.types,
  image: data.sprites.front_shiny,
})
