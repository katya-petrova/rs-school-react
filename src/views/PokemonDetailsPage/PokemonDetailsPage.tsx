import React, { useEffect, useState } from 'react';
import './PokemonDetailsPage.css';
import { fetchByName } from '../../services/apiService';
import { Result } from '../../interfaces/results';
import { useLocation, useNavigate } from 'react-router-dom';

interface PokemonDetailProps {
  id: string;
}

const PokemonDetailPage: React.FC<PokemonDetailProps> = ({ id }) => {
  const [pokemon, setPokemon] = useState<Result | null>(null);
  const [lastFetchedId, setLastFetchedId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchPokemon = async () => {
      setIsLoading(true);
      const result = (await fetchByName(id)) as unknown as Result[];
      setPokemon(result[0]);
      setIsLoading(false);
    };

    if (id !== lastFetchedId) {
      setLastFetchedId(id);
      fetchPokemon();
    }
  }, [id, lastFetchedId]);

  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    const urlParams = new URLSearchParams(location.search);
    urlParams.delete('pokemon');
    navigate('?' + urlParams.toString());
  };

  return (
    <div className="details-card">
      {isLoading ? (
        <div className="spinner" role="progressbar"></div>
      ) : pokemon ? (
        <>
          <button onClick={handleClose} className="close-btn">
            X
          </button>

          <h2>{pokemon.name}:</h2>
          <div className="view-details">
            <div className="front">
              <h4>Front view</h4>
              <img src={pokemon.image} alt={pokemon.name} />
            </div>
            <div className="back">
              <h4>Back view</h4>
              <img src={pokemon.back_view} alt={pokemon.name} />
            </div>
          </div>

          <p>
            <b>Types: </b>
            {pokemon.types.map((type) => type.type.name).join(', ')}
          </p>
          <p>
            <b>Height: </b> {pokemon.height}
          </p>
          <p>
            <b>Weight: </b> {pokemon.weight}
          </p>
        </>
      ) : null}
    </div>
  );
};

export default PokemonDetailPage;
