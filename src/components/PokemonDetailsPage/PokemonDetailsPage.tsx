import React, { useContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ThemeContext } from '../../context/ThemeContext';
import { useGetPokemonByNameQuery } from '../../services/pokemonApi';
import './PokemonDetailsPage.scss';

const PokemonDetailPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams?.get('pokemon') as string;

  const { data: pokemon, isFetching } = useGetPokemonByNameQuery(id, {
    skip: !id,
  });

  const context = useContext(ThemeContext);
  const className = `details-card ${context.theme}`;

  const handleClose = () => {
    const params = new URLSearchParams(searchParams as unknown as string);
    params.delete('pokemon');
    router.push(`?${params.toString()}`);
  };

  return (
    <div className={className}>
      {isFetching ? (
        <div className="spinner" role="progressbar"></div>
      ) : pokemon ? (
        <>
          <button
            onClick={handleClose}
            className={`close-btn ${context.theme}`}
          >
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
