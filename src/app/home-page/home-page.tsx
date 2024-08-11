'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import NavigationButtons from '../../components/NavigationButtons/NavigationButtons';
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle';
import { useLocalStorage } from '../../hooks/local-storage-hook';
import { ISearchResults, Result } from '../../interfaces/results';
import SearchInput from '../../components/SearchInput/SearchInput';
import SearchResults from '../../components/SearchResults/SearchResults';
import './home-page.css';
import PokemonDetailPage from '../../components/PokemonDetailsPage/PokemonDetailsPage';
import Cookies from 'js-cookie';

interface ClientComponentProps {
  allPokemonsData: ISearchResults;
  pokemonData: Result[];
  pokemonDetail: Result[];
  currentPage: number;
}

export default function ClientComponent({
  allPokemonsData,
  pokemonData,
  pokemonDetail,
  currentPage,
}: ClientComponentProps) {
  const [term, setTerm] = useLocalStorage('term', '');
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shouldThrowError, setShouldThrowError] = useState<boolean>(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const pokemonId = searchParams.get('pokemon');
    setSelectedPokemon(pokemonId);
  }, [searchParams]);

  const handleSearch = async (searchTerm: string) => {
    setLoading(true);
    Cookies.set('term', searchTerm);
    setTerm(searchTerm);

    router.refresh();
    await new Promise((resolve) => setTimeout(resolve, 500));
    setLoading(false);
    if (term) setSelectedPokemon(null);
  };

  const handlePageChange = async (newPage: number) => {
    setLoading(true);
    const params = new URLSearchParams({
      page: newPage.toString(),
      pokemon: selectedPokemon || '',
    });
    await router.push(`/?${params.toString()}`);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const nextPage = () => {
    const newPage = currentPage + 1;
    handlePageChange(newPage);
  };

  const prevPage = () => {
    const newPage = Math.max(1, currentPage - 1);
    handlePageChange(newPage);
  };

  const throwError = () => {
    setShouldThrowError(true);
  };

  if (shouldThrowError) throw new Error('This is a test error.');

  return (
    <div>
      <div className="top-panel">
        <SearchInput term={term} onSearch={handleSearch} />
        <button onClick={throwError}>Throw Error</button>
        <ThemeToggle />
      </div>
      <section className="results">
        {loading ? (
          <div className="spinner" data-testid="spinner"></div>
        ) : (
          <>
            <SearchResults
              results={
                term
                  ? (pokemonData as unknown as Result[])
                  : (allPokemonsData?.results as unknown as Result[])
              }
            />
            {selectedPokemon && (
              <PokemonDetailPage pokemon={pokemonDetail[0] || []} />
            )}
          </>
        )}
      </section>
      {!term && (
        <NavigationButtons
          currentPage={currentPage}
          totalPages={Math.ceil(allPokemonsData.count / 6)}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      )}
    </div>
  );
}
