import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ClientComponent from './home-page';
import { Provider } from 'react-redux';
import store from '../../store/store';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('js-cookie', () => ({
  set: jest.fn(),
}));

const mockPush = jest.fn();
const mockRefresh = jest.fn();
const mockPathname = '/some-path';

beforeEach(() => {
  (useRouter as jest.Mock).mockImplementation(() => ({
    push: mockPush,
    refresh: mockRefresh,
  }));
  (useSearchParams as jest.Mock).mockImplementation(
    () => new URLSearchParams()
  );
  (usePathname as jest.Mock).mockImplementation(() => mockPathname);
});

const dummyProps = {
  allPokemonsData: {
    results: [
      {
        id: '1',
        name: 'Pikachu',
        url: 'https://pokeapi.co/api/v2/pokemon/25/',
        types: [{ type: { name: 'electric' } }],
        abilities: [],
      },
    ],
    count: 1,
  },
  pokemonData: [
    {
      name: 'Pikachu',
      id: 'test',
      image: 'pikachu_front.png',
      back_view: 'pikachu_back.png',
      types: [{ type: { name: 'electric' } }],
      abilities: [],
      height: '4',
      weight: '12',
    },
  ],
  pokemonDetail: [
    {
      name: 'Pikachu',
      id: 'test2',
      image: 'pikachu_front.png',
      back_view: 'pikachu_back.png',
      types: [{ type: { name: 'electric' } }],
      abilities: [],
      height: '4',
      weight: '12',
    },
  ],
  currentPage: 1,
};

describe('ClientComponent', () => {
  test('handlePageChange calls router.push with the correct parameters', async () => {
    render(
      <Provider store={store}>
        <ClientComponent {...dummyProps} />
      </Provider>
    );

    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/?page=2&pokemon=');
    });

    fireEvent.click(screen.getByText('Prev'));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/?page=1&pokemon=');
    });
  });

  test('handlePageChange sets and clears loading state', async () => {
    render(
      <Provider store={store}>
        <ClientComponent {...dummyProps} />
      </Provider>
    );

    fireEvent.click(screen.getByText('Next'));
    expect(screen.getByTestId('spinner')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });
  });

  test('nextPage increments currentPage and calls handlePageChange', async () => {
    render(
      <Provider store={store}>
        <ClientComponent {...dummyProps} />
      </Provider>
    );

    fireEvent.click(screen.getByText('Next'));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/?page=2&pokemon=');
    });
  });

  test('prevPage decrements currentPage and calls handlePageChange', async () => {
    dummyProps.currentPage = 2;

    render(
      <Provider store={store}>
        <ClientComponent {...dummyProps} />
      </Provider>
    );

    fireEvent.click(screen.getByText('Prev'));
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/?page=1&pokemon=');
    });
  });

  test('handleSearch calls router.refresh', async () => {
    render(
      <Provider store={store}>
        <ClientComponent {...dummyProps} />
      </Provider>
    );

    fireEvent.change(
      screen.getByPlaceholderText('Type pokemon name e.g. raticate'),
      {
        target: { value: 'Charmander' },
      }
    );

    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(mockRefresh).toHaveBeenCalledTimes(1);
    });
  });
});
