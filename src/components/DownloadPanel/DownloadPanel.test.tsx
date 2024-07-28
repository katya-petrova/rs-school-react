import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import { add, removeAll } from '../../store/selectedPokemonsSlice';
import DownloadPanel from './DownloadPanel';
import store from '../../store/store';
import Papa from 'papaparse';

jest.mock('papaparse', () => ({
  unparse: jest.fn(),
}));

const originalCreateObjectURL = URL.createObjectURL;

describe('DownloadPanel', () => {
  beforeEach(() => {
    store.dispatch(removeAll());
  });

  beforeAll(() => {
    global.URL.createObjectURL = jest.fn();
  });

  afterAll(() => {
    URL.createObjectURL = originalCreateObjectURL;
  });

  test('displays the number of selected items', () => {
    store.dispatch({
      type: 'selectedPokemons/add',
      payload: [
        {
          id: '1',
          name: 'Bulbasaur',
          image: 'url',
          abilities: [],
          types: [],
          height: '',
          weight: '',
        },
      ],
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DownloadPanel />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/items are selected/i)).toBeInTheDocument();
  });

  test('calls dispatch to unselect all items when button is clicked', () => {
    store.dispatch({
      type: 'selectedPokemons/add',
      payload: [
        {
          id: '1',
          name: 'Bulbasaur',
          image: 'url',
          abilities: [],
          types: [],
          height: '',
          weight: '',
        },
      ],
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DownloadPanel />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText(/Unselect All/i));

    const state = store.getState();
    expect(state.selectedPokemons.selectedPokemons).toHaveLength(0);
  });

  test('starts a file download when Download button is clicked', () => {
    store.dispatch(
      add({
        id: '5',
        name: 'Pikachu',
        image: 'https://images.com/pikachu',
        back_view: 'img',
        types: [{ type: { name: 'Electric' } }],
        abilities: [{ ability: { name: 'Lightning Rod' } }],
        weight: '6',
        height: '4',
      })
    );

    const createElementSpy = jest.spyOn(document, 'createElement');

    render(
      <Provider store={store}>
        <MemoryRouter>
          <DownloadPanel />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(screen.getByText('Download'));

    const expectedPokemons = [
      {
        id: '5',
        name: 'Pikachu',
        image: 'https://images.com/pikachu',
        back_view: 'img',
        types: 'Electric',
        abilities: 'Lightning Rod',
        weight: '6',
        height: '4',
      },
    ];

    expect(Papa.unparse).toHaveBeenCalledWith(expectedPokemons);
    expect(createElementSpy).toHaveBeenCalled();

    createElementSpy.mockRestore();
  });
});
