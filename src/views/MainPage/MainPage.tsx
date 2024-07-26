import React, { useState, useEffect } from 'react';
import './MainPage.css';
import SearchInput from '../../components/SearchInput/SearchInput';
import SearchResults from '../../components/SearchResults/SearchResults';
import { usePagination } from '../../hooks/pagination-hook';
import { useLocation } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/local-storage-hook';
import PokemonDetailPage from '../PokemonDetailsPage/PokemonDetailsPage';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import {
  useGetAllPokemonsQuery,
  useGetPokemonByNameQuery,
} from '../../services/pokemonApi';

const MainPage: React.FC = () => {
  const location = useLocation();
  const [term, setTerm] = useLocalStorage('term', '');
  const [shouldThrowError, setShouldThrowError] = useState<boolean>(false);
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);

  const { pageNumber: currentPage, setPageNumber: setCurrentPage } =
    usePagination();

  const PAGE_SIZE = 6;

  const { data: allPokemonsData, isLoading: isLoadingAllPokemons } =
    useGetAllPokemonsQuery({
      limit: PAGE_SIZE,
      offset: currentPage * PAGE_SIZE,
    });

  const { data: pokemonData, isLoading: isLoadingPokemon } =
    useGetPokemonByNameQuery(term, {
      skip: !term,
    });

  const isLoading = isLoadingAllPokemons || isLoadingPokemon;
  useEffect(() => {
    console.log('Loading status of all pokemons:', isLoadingAllPokemons);
  }, [isLoadingAllPokemons]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const rawPage = params.get('page');
    const newPokemon = params.get('pokemon');
    const newPage = rawPage ? parseInt(rawPage, 10) - 1 : 0;
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
    setSelectedPokemon(newPokemon);
  }, [location.search]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value);
  };

  const handleButtonClick = () => {};

  const throwError = () => {
    setShouldThrowError(true);
  };

  if (shouldThrowError) {
    throw new Error('This is a test error.');
  }

  return (
    <div>
      <div className="top-panel">
        <section>
          <SearchInput
            term={term}
            onChange={handleInputChange}
            onSearch={handleButtonClick}
          />
        </section>
        <button onClick={throwError}>Throw Error</button>
        <ThemeToggle />
      </div>
      <section className="results">
        {isLoading ? (
          <div className="spinner"></div>
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
            {selectedPokemon && <PokemonDetailPage id={selectedPokemon} />}
          </>
        )}
      </section>
      {allPokemonsData && (
        <NavigationButtons
          currentPage={currentPage}
          totalPages={Math.ceil(allPokemonsData.count / PAGE_SIZE)}
          nextPage={() => setCurrentPage(currentPage + 1)}
          prevPage={() => setCurrentPage(currentPage - 1)}
        />
      )}
    </div>
  );
};

export default MainPage;
