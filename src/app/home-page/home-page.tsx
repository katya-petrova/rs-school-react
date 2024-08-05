'use client';

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPage } from '../../store/currentPageSlice';
import SearchInput from '../../components/SearchInput/SearchInput';
import SearchResults from '../../components/SearchResults/SearchResults';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useLocalStorage } from '../../hooks/local-storage-hook';
import PokemonDetailPage from '../../components/PokemonDetailsPage/PokemonDetailsPage';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import {
  useGetAllPokemonsQuery,
  useGetPokemonByNameQuery,
} from '../../services/pokemonApi';
import { RootState } from '../../store/store';

import './home-page.css';

const MainPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const currentPage = useSelector((state: RootState) => state.page);
  const [term, setTerm] = useLocalStorage('term', '');
  const [shouldThrowError, setShouldThrowError] = useState<boolean>(false);
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const PAGE_SIZE = 6;

  const { data: allPokemonsData, isFetching: isFetchingAllPokemons } =
    useGetAllPokemonsQuery({
      limit: PAGE_SIZE,
      offset: currentPage * PAGE_SIZE,
    });

  const { data: pokemonData, isFetching: isFetchingPokemon } =
    useGetPokemonByNameQuery(term, { skip: !term });

  const isLoading = isFetchingAllPokemons || isFetchingPokemon;

  useEffect(() => {
    const page = searchParams?.get('page');
    const pokemon = searchParams?.get('pokemon');
    const newPage = parseInt(page || '1', 10) - 1;

    setSelectedPokemon(pokemon!);
    if (newPage !== currentPage) {
      dispatch(setPage(newPage));
    }
  }, [searchParams]);

  useEffect(() => {
    router.push(`${pathname}?page=${currentPage + 1}`);
  }, [currentPage, pathname, router]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value);
  };

  const handleSearch = () => {};

  const throwError = () => {
    setShouldThrowError(true);
  };

  if (shouldThrowError) throw new Error('This is a test error.');

  const nextPage = () => dispatch(setPage(currentPage + 1));
  const prevPage = () => dispatch(setPage(Math.max(0, currentPage - 1)));

  return (
    <div>
      <div className="top-panel">
        <SearchInput
          term={term}
          onChange={handleInputChange}
          onSearch={handleSearch}
        />
        <button onClick={throwError}>Throw Error</button>
        <ThemeToggle />
      </div>
      <section className="results">
        {isLoading ? (
          <div className="spinner" data-testid="spinner"></div>
        ) : (
          <>
            <SearchResults
              results={
                term
                  ? pokemonData
                    ? [pokemonData]
                    : []
                  : allPokemonsData?.results || []
              }
            />
            {selectedPokemon && <PokemonDetailPage />}
          </>
        )}
      </section>
      {allPokemonsData && (
        <NavigationButtons
          currentPage={currentPage}
          totalPages={Math.ceil(allPokemonsData.count / PAGE_SIZE)}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      )}
    </div>
  );
};

export default MainPage;
