import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import PokemonDetailPage from './PokemonDetailsPage';
import { ThemeContext } from '../../context/ThemeContext';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const renderWithTheme = (theme: string, component: React.ReactNode) => {
  return render(
    <ThemeContext.Provider value={{ theme: theme, setTheme: () => {} }}>
      {component}
    </ThemeContext.Provider>
  );
};

describe('PokemonDetailPage', () => {
  const mockPush = jest.fn();
  const mockPokemon = {
    name: 'Pikachu',
    id: 'test',
    image: 'pikachu_front.png',
    back_view: 'pikachu_back.png',
    types: [{ type: { name: 'electric' } }],
    abilities: [],
    height: '4',
    weight: '12',
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { pokemon: 'pikachu' },
      push: mockPush,
    });
  });

  test('renders pokemon details', () => {
    const { getByText, getAllByAltText } = renderWithTheme(
      'dark',
      <PokemonDetailPage pokemon={mockPokemon} />
    );
    expect(getByText(/Pikachu:/i)).toBeInTheDocument();
    expect(getByText('electric')).toBeInTheDocument();

    const pokemonImages = getAllByAltText('Pikachu');
    expect(pokemonImages.length).toBe(2);
    expect(pokemonImages[0]).toHaveAttribute('src', 'pikachu_front.png');
    expect(pokemonImages[1]).toHaveAttribute('src', 'pikachu_back.png');
  });

  test('handles close button correctly', () => {
    const { getByText } = renderWithTheme(
      'dark',
      <PokemonDetailPage pokemon={mockPokemon} />
    );
    fireEvent.click(getByText('X'));
    expect(mockPush).toHaveBeenCalledWith(`?`, undefined, { shallow: true });
  });

  test('renders not found text when no pokemon provided', () => {
    const { getByText } = renderWithTheme(
      'dark',
      <PokemonDetailPage pokemon={null} />
    );
    expect(getByText('Pokemon not found')).toBeInTheDocument();
  });
});
