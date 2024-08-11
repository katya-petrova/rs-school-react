import { ISearchResults, Result } from '../interfaces/results';
import { fetchPokemons, fetchByName } from '../services/apiService';
import ClientComponent from './home-page/home-page';
import { cookies } from 'next/headers';

interface PageProps {
  searchParams: {
    page?: string;
    pokemon?: string;
  };
}

export default async function Page({ searchParams }: PageProps) {
  const currentPage = parseInt(searchParams.page || '1', 10);
  const pokemonName = searchParams.pokemon || '';
  const term = cookies().get('term')?.value || '';

  const allPokemonsData = await fetchPokemons(6, (currentPage - 1) * 6);
  const pokemonData = term ? await fetchByName(term) : [];
  let pokemonDetail: ISearchResults | Result[] = [];

  if (pokemonName) {
    pokemonDetail = pokemonName ? await fetchByName(pokemonName) : [];
  }

  return (
    <ClientComponent
      allPokemonsData={allPokemonsData}
      pokemonData={pokemonData as Result[]}
      pokemonDetail={pokemonDetail as Result[]}
      currentPage={currentPage}
    />
  );
}
