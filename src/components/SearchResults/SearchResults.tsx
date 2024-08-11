import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Result } from '../../interfaces/results';
import { remove, add } from '../../store/selectedPokemonsSlice';
import { ThemeContext } from '../../context/ThemeContext';
import { RootState } from '../../store/store';
import './SearchResults.scss';
import DownloadPanel from '../DownloadPanel/DownloadPanel';

interface SearchResultsProps {
  results: Result[];
}

const SearchResults: React.FC<SearchResultsProps> = (props) => {
  const context = useContext(ThemeContext);
  const className = `pokemon-item ${context.theme}`;
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPage = searchParams?.get('page') || '1';
  const dispatch = useDispatch();
  const selectedPokemons = useSelector(
    (state: RootState) => state.selectedPokemons.selectedPokemons
  );
  const dlPanelClassName = `download ${selectedPokemons.length > 0 ? '' : 'hide'}`;

  const handleBackgroundClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.currentTarget === e.target) {
      const newSearchParams = new URLSearchParams(searchParams?.toString());
      newSearchParams.delete('pokemon');
      router.push(`${pathname}?${newSearchParams.toString()}`);
    }
  };

  const handleCheckboxChange = (pokemon: Result) => {
    if (selectedPokemons.some((selected) => selected.id === pokemon.id)) {
      dispatch(remove(pokemon));
    } else {
      dispatch(add(pokemon));
    }
  };

  if (!props.results || props.results.length === 0) {
    return (
      <div className="search-results">
        <p>Pokemons not found</p>
      </div>
    );
  }

  return (
    <div className="search-results" onClick={handleBackgroundClick}>
      {props.results.map((result) => (
        <div key={result.id} className={className}>
          <input
            type="checkbox"
            checked={selectedPokemons.some(
              (selected) => selected.id === result.id
            )}
            onChange={() => handleCheckboxChange(result)}
          />
          <Link href={`/?page=${currentPage}&pokemon=${result.id}`} passHref>
            <div className={`pokemon ${context.theme}`}>
              <div className="pokemon-name">
                <h2>{result.name}</h2>
                <img src={result.image} alt={result.name} />
              </div>

              <div className="pokemon-description">
                <p>
                  <b>Abilities:</b>
                  {result.abilities
                    .map(
                      (ability: { ability: { name: string } }) =>
                        ability.ability.name
                    )
                    .join(', ')}
                </p>
                <p>
                  <b>Types:</b>
                  {result.types
                    .map((type: { type: { name: string } }) => type.type.name)
                    .join(', ')}
                </p>
                <p>
                  <b>Height:</b> {result.height}
                </p>
                <p>
                  <b>Weight:</b> {result.weight}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
      <div className={dlPanelClassName}>{<DownloadPanel />}</div>
    </div>
  );
};

export default SearchResults;
