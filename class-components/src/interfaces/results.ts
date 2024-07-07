export interface SearchResultsProps {
  results: Result[];
}

export interface Result {
  id: string;
  name: string;
  weight: string;
  image: string;
  abilities: Abilities[];
  height: string;
  types: Types[];
  sprites: Sprites;
}

interface Abilities {
  ability: Ability;
}

interface Ability {
  name: string;
}

interface Types {
  type: Type;
}

interface Type {
  name: string;
}

interface Sprites {
  front_shiny: string;
}
