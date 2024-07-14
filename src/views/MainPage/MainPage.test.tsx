import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import MainPage from './MainPage';
import { fetchPokemons, fetchByName } from '../../services/apiService';
import { Result } from '../../interfaces/results';
import ErrorBoundary from '../../components/ErrorBoundary/ErrorBoundary';

jest.mock('../../services/apiService');

const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: jest.fn((key: string) => store[key] ?? null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('MainPage', () => {
  let mockedFetchPokemons: jest.MockedFunction<typeof fetchPokemons>;
  let mockedFetchByName: jest.MockedFunction<typeof fetchByName>;

  beforeEach(() => {
    jest.clearAllMocks();
    mockedFetchPokemons = fetchPokemons as jest.MockedFunction<
      typeof fetchPokemons
    >;
    mockedFetchByName = fetchByName as jest.MockedFunction<typeof fetchByName>;
  });

  const pokemonsMockData = {
    results: [
      {
        id: 'bulbasaur',
        name: 'bulbasaur',
        weight: '69',
        abilities: [],
        height: '7',
        types: [],
        image: '',
        back_view: '',
      },
      {
        id: 'ivysaur',
        name: 'ivysaur',
        weight: '55',
        abilities: [],
        height: '7',
        types: [],
        image: '',
        back_view: '',
      },
    ],
    count: 2,
  };

  const pokemonDetailsMockData = [
    {
      id: '1',
      name: 'Test Pokemon',
      weight: '1',
      image: 'http://example.com/test-image.png',
      back_view: 'http://example.com/test-back-view.png',
      abilities: [{ ability: { name: 'run' } }, { ability: { name: 'jump' } }],
      types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],

      front_shiny: 'test',
      back_shiny: 'test1',

      height: '1',
    },
  ];

  test('clicking a result triggers an additional API call to fetch detailed information', async () => {
    mockedFetchPokemons.mockResolvedValue(pokemonsMockData);
    mockedFetchByName.mockResolvedValue(
      pokemonDetailsMockData as unknown as Result[]
    );

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedFetchPokemons).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });

    const firstPokemon = screen.getByText('bulbasaur');
    fireEvent.click(firstPokemon);

    await waitFor(() => {
      expect(mockedFetchByName).toHaveBeenCalledWith('bulbasaur');
    });

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(
      screen.getByText((_content, element) => {
        return element?.textContent === 'Weight: 69';
      })
    ).toBeInTheDocument();
  });

  test('pagination buttons work correctly', async () => {
    mockedFetchPokemons.mockResolvedValue({
      results: pokemonsMockData.results,
      count: 10,
    });

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedFetchPokemons).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => {
      expect(mockedFetchPokemons).toHaveBeenLastCalledWith(6, 6);
    });

    fireEvent.click(screen.getByText('Prev'));

    await waitFor(() => {
      expect(mockedFetchPokemons).toHaveBeenLastCalledWith(6, 0);
    });
  });

  test('retrieves the value from local storage upon mounting', async () => {
    localStorageMock.setItem('term', JSON.stringify('ivysaur'));

    mockedFetchPokemons.mockResolvedValueOnce({
      results: pokemonsMockData.results,
      count: 2,
    });

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(
      'Type pokemon name e.g. raticate'
    ) as HTMLInputElement;

    await waitFor(() => {
      expect(localStorageMock.getItem).toHaveBeenCalledWith('term');
      expect(input).toHaveValue('');
    });
  });

  test('loads all pokemons on mount when term is empty', async () => {
    (fetchPokemons as jest.Mock).mockResolvedValueOnce(pokemonsMockData);

    render(
      <MemoryRouter>
        <MainPage />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(fetchPokemons).toHaveBeenCalledWith(6, 0);
    });
  });

  test('displays error message when "Throw Error" button is clicked', () => {
    (fetchPokemons as jest.Mock).mockResolvedValueOnce(pokemonsMockData);

    const { getByRole, getByText } = render(
      <MemoryRouter>
        <ErrorBoundary>
          <MainPage />
        </ErrorBoundary>
      </MemoryRouter>
    );

    const consoleSpy = jest.spyOn(console, 'error');
    consoleSpy.mockImplementation(() => {});

    fireEvent.click(getByRole('button', { name: /Throw Error/i }));

    expect(getByText('Something went wrong🙀')).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
