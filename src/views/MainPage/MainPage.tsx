import React, { useState, useEffect } from 'react';
import './MainPage.css';
import SearchInput from '../../components/SearchInput/SearchInput';
import SearchResults from '../../components/SearchResults/SearchResults';
import { fetchByName, fetchPokemons } from '../../services/apiService';
import { Result } from '../../interfaces/results';
import { usePagination } from '../../hooks/pagination-hook';
import { useLocation } from 'react-router-dom';
import { useLocalStorage } from '../../hooks/local-storage-hook';

const MainPage: React.FC = () => {
  const location = useLocation();
  const [term, setTerm] = useLocalStorage('term', '');
  const [results, setResults] = useState<Result[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [shouldThrowError, setShouldThrowError] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState(0);

  const { pageNumber: currentPage, setPageNumber: setCurrentPage } =
    usePagination();

  useEffect(() => {
    if (!term) {
      loadAllPokemons();
    }
  }, [currentPage]);

  useEffect(() => {
    const rawPage = new URLSearchParams(location.search).get('page');
    const newPage = rawPage ? parseInt(rawPage, 10) - 1 : 0;
    if (newPage !== currentPage) {
      setCurrentPage(newPage);
    }
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
    setCurrentPage((page) => page + 1);
  };

  const prevPage = () => {
    setCurrentPage((page) => page - 1);
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
      </div>
      <section>
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <SearchResults results={results} />
        )}
      </section>
      {results.length > 1 ? (
        <div>
          <button disabled={currentPage === 0} onClick={prevPage}>
            Prev
          </button>
          <button disabled={currentPage === totalPages - 1} onClick={nextPage}>
            Next
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default MainPage;
