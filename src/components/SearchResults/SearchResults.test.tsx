import { render, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import SearchResults from './SearchResults';
import store from '../../store/store';
import '@testing-library/jest-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { add } from '../../store/selectedPokemonsSlice';
import React from 'react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
  })),
  useSearchParams: jest.fn(() => new URLSearchParams('?pokemon=1')),
  usePathname: jest.fn(() => '/some-path'),
}));

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
  test('displays the results', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
          <SearchResults results={results} />
        </ThemeContext.Provider>
      </Provider>
    );

    expect(getByText('Bulbasaur')).toBeInTheDocument();
  });

  test('handles checkbox change', () => {
    const { getByRole } = render(
      <Provider store={store}>
        <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
          <SearchResults results={results} />
        </ThemeContext.Provider>
      </Provider>
    );

    const checkbox = getByRole('checkbox');
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
    const { getByText } = render(
      <Provider store={store}>
        <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
          <SearchResults results={results} />
        </ThemeContext.Provider>
      </Provider>
    );

    fireEvent.click(getByText('Bulbasaur').closest('div') as HTMLElement);

    expect(window.location.search).toBe('');
  });

  test('shows download panel when pokemons are selected', () => {
    store.dispatch(add(results[0]));

    const { getByText } = render(
      <Provider store={store}>
        <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
          <SearchResults results={results} />
        </ThemeContext.Provider>
      </Provider>
    );

    expect(getByText(/Download/i)).toBeInTheDocument();
  });
});
