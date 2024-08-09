import { screen, render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { useRouter } from 'next/router';
import SearchResults from './SearchResults';
import store from '../../store/store';
import '@testing-library/jest-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { add } from '../../store/selectedPokemonsSlice';
import React from 'react';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;

const results = [
  {
    id: '1',
    name: 'Bulbasaur',
    image: 'bulbasaur-image-url',
    back_view: 'img',
    abilities: [{ ability: { name: 'overgrow' } }],
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    height: '7',
    weight: '69',
  },
];

describe('SearchResults', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      query: { pokemon: 'bulbasaur' },
      push: jest.fn(),
      asPath: '/?page=1&pokemon=1',
    });
  });

  test('displays the results', () => {
    render(
      <Provider store={store}>
        <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
          <SearchResults results={results} />
        </ThemeContext.Provider>
      </Provider>
    );

    expect(screen.getByText('Bulbasaur')).toBeInTheDocument();
  });

  test('handles checkbox change', () => {
    render(
      <Provider store={store}>
        <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
          <SearchResults results={results} />
        </ThemeContext.Provider>
      </Provider>
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(store.getState().selectedPokemons.selectedPokemons).toContainEqual(
      results[0]
    );

    fireEvent.click(checkbox);

    expect(
      store.getState().selectedPokemons.selectedPokemons
    ).not.toContainEqual(results[0]);
  });

  test('removes pokemon from URL on background click', () => {
    render(
      <Provider store={store}>
        <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
          <SearchResults results={results} />
        </ThemeContext.Provider>
      </Provider>
    );

    fireEvent.click(
      screen.getByText('Bulbasaur').closest('div') as HTMLElement
    );

    expect(window.location.search).toBe('');
  });

  test('shows download panel when pokemons are selected', () => {
    store.dispatch(add(results[0]));

    render(
      <Provider store={store}>
        <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
          <SearchResults results={results} />
        </ThemeContext.Provider>
      </Provider>
    );

    expect(screen.getByText(/Download/i)).toBeInTheDocument();
  });
});
