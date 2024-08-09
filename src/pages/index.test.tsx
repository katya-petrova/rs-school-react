import React from 'react';
import { act, fireEvent, render, screen } from '@testing-library/react';
import MainPage, { getServerSideProps } from '.';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import store from '../store/store';
import { IncomingMessage } from 'http';

jest.mock('../services/apiService', () => ({
  fetchPokemons: jest.fn<
    Promise<{ results: Result[]; count: number }>,
    [number, number]
  >(),
  fetchByName: jest.fn<Promise<Result>, [string | number]>(),
}));

import * as api from '../services/apiService';
import { Result } from '../interfaces/results';
import { GetServerSidePropsContext, NextApiResponse } from 'next';

jest.mock('js-cookie', () => ({
  set: jest.fn(),
}));

const mockPush = jest.fn();

jest.mock('next/router', () => {
  return {
    useRouter() {
      return {
        query: { page: '2', pokemon: 'pikachu' },
        push: mockPush,
        events: {
          on: jest.fn(),
          off: jest.fn(),
        },
        pathname: '/',
        asPath: '/',
      };
    },
  };
});

const mockProps = {
  allPokemonsData: {
    results: [],
    count: 0,
  },
  pokemonData: null,
  pokemonDetail: [],
  currentPage: 2,
};

describe('MainPage Component', () => {
  test('renders MainPage component with expected elements', () => {
    act(() => {
      render(
        <Provider store={store}>
          <MainPage {...mockProps} />
        </Provider>
      );
    });

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByText(/Throw Error/)).toBeInTheDocument();
    expect(screen.getByText(/Next/)).toBeInTheDocument();
    expect(screen.getByText(/Prev/)).toBeInTheDocument();
  });
  it('navigates to the next page when nextPage function is called', () => {
    render(
      <Provider store={store}>
        <MainPage {...mockProps} />
      </Provider>
    );

    const nextButton = screen.getByRole('button', { name: /next/i });

    fireEvent.click(nextButton);

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/',
      query: { page: '3', pokemon: 'pikachu' },
    });
  });
  it('decreases page by 1 and navigates to previous page', () => {
    render(
      <Provider store={store}>
        <MainPage {...mockProps} />
      </Provider>
    );

    const prevButton = screen.getByRole('button', { name: /prev/i });
    fireEvent.click(prevButton);

    expect(mockPush).toHaveBeenCalledWith({
      pathname: '/',
      query: { page: '1', pokemon: 'pikachu' },
    });
  });
});

describe('getServerSideProps', () => {
  it('returns correct data on fetch', async () => {
    const mockedPokemonsData = { results: [] };
    const mockedPokemonData = { name: 'bulbasaur' };

    (api.fetchPokemons as jest.Mock).mockResolvedValue(mockedPokemonsData);
    (api.fetchByName as jest.Mock).mockResolvedValue(mockedPokemonData);

    const mockReq = {
      headers: { cookie: 'term=pikachu' },
      cookies: { term: 'pikachu' },
      url: '/',
      method: 'GET',
    } as unknown as IncomingMessage & {
      cookies: Partial<{ [key: string]: string }>;
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as NextApiResponse;

    const context: GetServerSidePropsContext = {
      query: { page: '1' },
      req: mockReq,
      res: mockRes,
      resolvedUrl: '',
      preview: false,
      locales: [],
      defaultLocale: '',
    };

    const response = await getServerSideProps(context);

    expect(response).toEqual({
      props: {
        allPokemonsData: mockedPokemonsData,
        pokemonData: mockedPokemonData,
        pokemonDetail: null,
        currentPage: 1,
      },
    });

    expect(api.fetchPokemons).toHaveBeenCalledWith(6, 0);
    expect(api.fetchByName).toHaveBeenCalledWith('pikachu');
  });

  it('handles exceptions correctly', async () => {
    (api.fetchPokemons as jest.Mock).mockRejectedValue(
      new Error('Network error')
    );

    const mockReq = {
      headers: { cookie: 'term=pikachu' },
      cookies: { term: 'pikachu' },
      url: '/',
      method: 'GET',
    } as unknown as IncomingMessage & {
      cookies: Partial<{ [key: string]: string }>;
    };

    const mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as NextApiResponse;

    const context: GetServerSidePropsContext = {
      query: { page: '1' },
      req: mockReq,
      res: mockRes,
      resolvedUrl: '',
      preview: false,
      locales: [],
      defaultLocale: '',
    };
    const response = await getServerSideProps(context);

    expect(response).toEqual({
      props: {
        allPokemonsData: null,
        pokemonData: [],
        pokemonDetail: [],
        currentPage: 1,
      },
    });
  });
});
