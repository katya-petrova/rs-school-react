import React, { useState, useEffect } from 'react';
import './MainPage.css';
import SearchInput from '../../components/SearchInput/SearchInput';
import SearchResults from '../../components/SearchResults/SearchResults';
import { fetchByName, fetchPokemons } from '../../services/apiService';
import { Result } from '../../interfaces/results';
import { usePagination } from '../../hooks/pagination-hook';
import { useLocation } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/local-storage-hook';
import PokemonDetailPage from '../PokemonDetailsPage/PokemonDetailsPage';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';

const MainPage: React.FC = () => {
  const location = useLocation();
  const [term, setTerm] = useLocalStorage('term', '');
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shouldThrowError, setShouldThrowError] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);

  const { pageNumber: currentPage, setPageNumber: setCurrentPage } =
    usePagination();

  useEffect(() => {
    if (!term) {
      loadAllPokemons();
    }
  }, [currentPage]);

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

  const PAGE_SIZE = 6;

  const loadAllPokemons = async () => {
    setIsLoading(true);
    const data = await fetchPokemons(PAGE_SIZE, currentPage * PAGE_SIZE);
    setIsLoading(false);
    setResults(data.results);
    setTotalPages(Math.ceil(data.count / PAGE_SIZE));
  };

  const search = async (term: string) => {
    setIsLoading(true);
    const response = await fetchByName(term);
    setIsLoading(false);
    if (Array.isArray(response)) {
      setResults(response as Result[]);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value);
  };

  const handleButtonClick = () => {
    if (term) search(term);
    else loadAllPokemons();
  };

  const throwError = () => {
    setShouldThrowError(true);
  };

  const nextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const prevPage = () => {
    setCurrentPage(currentPage - 1);
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
            <SearchResults results={results} />
            {selectedPokemon && <PokemonDetailPage id={selectedPokemon} />}
          </>
        )}
      </section>
      {results.length > 1 && (
        <NavigationButtons
          currentPage={currentPage}
          totalPages={totalPages}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      )}
    </div>
  );
};

export default MainPage;
