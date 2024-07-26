import { PokemonsDto } from './pokemons-dto';

export interface SearchResultsProps {
  results: Result[];
}

export interface SearchResults {
  results: PokemonsDto[];
  count: number;
}

export interface Result {
  id: string;
  name: string;
  weight: string;
  image: string;
  back_view: string;
  abilities: Abilities[];
  height: string;
  types: Types[];
  sprites?: Sprites;
}

export interface Abilities {
  ability: Ability;
}

interface Ability {
  name: string;
}

export interface Types {
  type: Type;
}

interface Type {
  name: string;
}

interface Sprites {
  front_shiny: string;
  back_shiny: string;
}
