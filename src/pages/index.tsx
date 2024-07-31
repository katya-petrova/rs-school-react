import React, { useState, useEffect } from 'react';
import './index.css';
import SearchInput from '../components/SearchInput/SearchInput';
import SearchResults from '../components/SearchResults/SearchResults';
import { useRouter } from 'next/router';
import { useLocalStorage } from '../hooks/local-storage-hook';
import PokemonDetailPage from '../components/PokemonDetailsPage/PokemonDetailsPage';
import NavigationButtons from '../components/NavigationButtons/NavigationButtons';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import {
  useGetAllPokemonsQuery,
  useGetPokemonByNameQuery,
} from '../services/pokemonApi';

const MainPage: React.FC = () => {
  const router = useRouter();
  const [term, setTerm] = useLocalStorage('term', '');
  const [shouldThrowError, setShouldThrowError] = useState<boolean>(false);
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const PAGE_SIZE = 6;

  const { data: allPokemonsData, isFetching: isFetchingAllPokemons } =
    useGetAllPokemonsQuery({
      limit: PAGE_SIZE,
      offset: currentPage * PAGE_SIZE,
    });

  const { data: pokemonData, isFetching: isFetchingPokemon } =
    useGetPokemonByNameQuery(term, {
      skip: !term,
    });

  const isLoading = isFetchingAllPokemons || isFetchingPokemon;

  useEffect(() => {
    const { page, pokemon } = router.query;
    const newPage = parseInt(page as string, 10) - 1 || 0;
    setSelectedPokemon(pokemon as string);
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
  }, [router.query]);

  useEffect(() => {
    const newUrlQuery = { ...router.query, page: (currentPage + 1).toString() };
    router.push(
      {
        pathname: router.pathname,
        query: newUrlQuery,
      },
      undefined,
      { shallow: true }
    );
  }, [currentPage]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value);
  };

  const handleSearch = () => {};

  const throwError = () => {
    setShouldThrowError(true);
  };

  if (shouldThrowError) throw new Error('This is a test error.');

  const nextPage = () => setCurrentPage((prevPage) => prevPage + 1);
  const prevPage = () =>
    setCurrentPage((prevPage) => Math.max(0, prevPage - 1));

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
