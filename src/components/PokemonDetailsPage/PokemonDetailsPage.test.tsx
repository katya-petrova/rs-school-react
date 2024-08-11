import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import PokemonDetailPage from './PokemonDetailsPage';
import { ThemeContext } from '../../context/ThemeContext';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
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

  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockImplementation(() => ({
      push: mockPush,
    }));

    Object.defineProperty(window, 'location', {
      writable: true,
      value: { search: '?pokemon=pikachu' },
    });
  });

  test('renders pokemon details correctly', () => {
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

  test('renders not found text when no pokemon provided', () => {
    const { getByText } = renderWithTheme(
      'dark',
      <PokemonDetailPage pokemon={null} />
    );
    expect(getByText('Pokemon not found')).toBeInTheDocument();
  });

  test('handleClose removes the pokemon query parameter and calls router.push', () => {
    const { getByRole } = renderWithTheme(
      'dark',
      <PokemonDetailPage pokemon={mockPokemon} />
    );

    const closeButton = getByRole('button', { name: 'X' });

    fireEvent.click(closeButton);

    expect(mockPush).toHaveBeenCalledWith('?');
  });
});
