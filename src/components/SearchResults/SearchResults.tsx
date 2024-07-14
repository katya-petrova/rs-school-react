import React from 'react';
import './SearchResults.css';
import { Result } from '../../interfaces/results';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface SearchResultsProps {
  results: Result[];
}

const SearchResults: React.FC<SearchResultsProps> = (props) => {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const currentPage = params.get('page');
  const navigate = useNavigate();

  const handleBackgroundClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    if (e.currentTarget === e.target) {
      const urlParams = new URLSearchParams(location.search);
      urlParams.delete('pokemon');
      navigate('?' + urlParams.toString());
    }
  };

  return (
    <div className="search-results" onClick={handleBackgroundClick}>
      {props.results.map((result) => {
        return (
          <Link
            to={`/?page=${currentPage || 1}&pokemon=${result.id}`}
            key={result.id}
          >
            {' '}
            <div className="pokemon-item">
              <div className="pokemon-name">
                <h2>{result.name}</h2>
                <img src={result.image} alt="" />
              </div>

              <div className="pokemon-description">
                <p>
                  <b>Abilities:</b>
                  {result.abilities
                    .map((ability) => ability.ability.name)
                    .join(', ')}
                </p>
                <p>
                  <b>Types:</b>
                  {result.types.map((type) => type.type.name).join(', ')}
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
        );
      })}
    </div>
  );
};

export default SearchResults;
