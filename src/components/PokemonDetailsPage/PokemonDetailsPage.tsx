import React, { useContext } from 'react';
import { useRouter } from 'next/router';
import { ThemeContext } from '../../context/ThemeContext';
import './PokemonDetailsPage.scss';
import { Result } from '../../interfaces/results';

interface PokemonDetailPageProps {
  pokemon: Result | null;
}

const PokemonDetailPage: React.FC<PokemonDetailPageProps> = ({ pokemon }) => {
  const router = useRouter();
  const context = useContext(ThemeContext);
  const className = `details-card ${context.theme}`;

  const handleClose = () => {
    const urlParams = new URLSearchParams(
      router.query as Record<string, string>
    );
    urlParams.delete('pokemon');
    router.push(`?${urlParams.toString()}`, undefined, { shallow: true });
  };

  if (!pokemon) return <div>Pokemon not found</div>;

  return (
    <div className={className}>
      <button onClick={handleClose} className={`close-btn ${context.theme}`}>
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
        <b>Types:</b> {pokemon.types.map((type) => type.type.name).join(', ')}
      </p>
      <p>
        <b>Height:</b> {pokemon.height}
      </p>
      <p>
        <b>Weight:</b> {pokemon.weight}
      </p>
    </div>
  );
};

export default PokemonDetailPage;
