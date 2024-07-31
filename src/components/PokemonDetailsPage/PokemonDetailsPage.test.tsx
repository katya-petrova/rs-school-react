import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useRouter } from 'next/router';
import PokemonDetailPage from './PokemonDetailsPage';
import { ThemeContext } from '../../context/ThemeContext';
import { useGetPokemonByNameQuery } from '../../services/pokemonApi';

// Mocking the external hooks and context
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../../services/pokemonApi', () => ({
  useGetPokemonByNameQuery: jest.fn(),
}));

// Utility function to render component within theme provider
const renderWithTheme = (
  theme: string,
  component:
    | Iterable<React.ReactNode>
    | Promise<React.AwaitedReactNode>
    | React.JSX.Element
) => {
  return render(
    <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
      {' '}
      {component}
    </ThemeContext.Provider>
  );
};

describe('PokemonDetailPage', () => {
  const mockPush = jest.fn();
  const mockPokemon = {
    name: 'Pikachu',
    image: 'pikachu_front.png',
    back_view: 'pikachu_back.png',
    types: [{ type: { name: 'electric' } }],
    height: '4',
    weight: '12',
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      query: { pokemon: 'pikachu' },
      push: mockPush,
    });
    (useGetPokemonByNameQuery as jest.Mock).mockReturnValue({
      data: mockPokemon,
      isFetching: false,
    });
  });

  test('renders loading spinner when data is fetching', () => {
    (useGetPokemonByNameQuery as jest.Mock).mockReturnValue({
      data: null,
      isFetching: true,
    });
    const { getByRole } = renderWithTheme('dark', <PokemonDetailPage />);
    expect(getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders pokemon details when data is available', () => {
    const { getByText } = renderWithTheme('dark', <PokemonDetailPage />);
    expect(getByText(/Pikachu:/i)).toBeInTheDocument();
    expect(getByText('electric')).toBeInTheDocument();
  });

  test('handles close button correctly', () => {
    const { getByText } = renderWithTheme('dark', <PokemonDetailPage />);
    fireEvent.click(getByText('X'));
    expect(mockPush).toHaveBeenCalledWith('?', undefined, { shallow: true });
  });
});
