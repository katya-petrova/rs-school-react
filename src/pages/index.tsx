import React, { useState, useEffect } from 'react';
import './index.css';
import SearchInput from '../components/SearchInput/SearchInput';
import SearchResults from '../components/SearchResults/SearchResults';
import { useRouter } from 'next/router';
import PokemonDetailPage from '../components/PokemonDetailsPage/PokemonDetailsPage';
import NavigationButtons from '../components/NavigationButtons/NavigationButtons';
import ThemeToggle from '../components/ThemeToggle/ThemeToggle';
import { useLocalStorage } from '../hooks/local-storage-hook';
import { Result, ISearchResults } from '../interfaces/results';
import { fetchByName, fetchPokemons } from '../services/apiService';
import { GetServerSideProps } from 'next';
import Cookies from 'js-cookie';
import { parseCookies } from 'nookies';

interface MainPageProps {
  allPokemonsData: ISearchResults;
  pokemonData: Result | null;
  pokemonDetail: Result[];
  currentPage: number;
}

const MainPage: React.FC<MainPageProps> = ({
  allPokemonsData,
  pokemonData,
  pokemonDetail,
  currentPage,
}) => {
  const router = useRouter();
  const [term, setTerm] = useLocalStorage('term', '');
  const [selectedPokemon, setSelectedPokemon] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [shouldThrowError, setShouldThrowError] = useState<boolean>(false);

  useEffect(() => {
    const { pokemon } = router.query;
    setSelectedPokemon(pokemon as string);
  }, [router.query]);

  useEffect(() => {
    const handleStart = () => setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router.events]);

  const handleSearch = (term: string) => {
    if (window) setTerm(term);

    Cookies.set('term', term);
    router.push(router.asPath);
  };

  const nextPage = () => {
    const newPage = currentPage + 1;
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage.toString() },
    });
  };

  const prevPage = () => {
    const newPage = Math.max(1, currentPage - 1);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page: newPage.toString() },
    });
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
              <PokemonDetailPage pokemon={pokemonDetail[0]} />
            )}
          </>
        )}
      </section>
      {allPokemonsData && (
        <NavigationButtons
          currentPage={currentPage}
          totalPages={Math.ceil(allPokemonsData.count / 6)}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = parseCookies(context);
  const page = parseInt(context.query.page as string, 10) || 1;
  const term = cookies.term || '';
  const pokemonId = context.query.pokemon as string | null;

  try {
    const allPokemonsData = await fetchPokemons(6, (page - 1) * 6);
    const pokemonData = term ? await fetchByName(term) : null;
    let pokemonDetail = null;

    if (pokemonId) {
      pokemonDetail = await fetchByName(pokemonId);
    }

    return {
      props: {
        allPokemonsData,
        pokemonData,
        pokemonDetail,
        currentPage: page,
      },
    };
  } catch (error) {
    console.error('Error fetching data:', error);
    return {
      props: {
        allPokemonsData: null,
        pokemonData: [],
        pokemonDetail: [],
        currentPage: page,
      },
    };
  }
};

export default MainPage;
