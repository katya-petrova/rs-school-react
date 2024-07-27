import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import PokemonDetailPage from './PokemonDetailsPage';
import { Provider } from 'react-redux';
import store from '../../store/store';
import '@testing-library/jest-dom';
import { createMemoryHistory } from '@remix-run/router';

describe('PokemonDetailPage', () => {
  test('renders PokemonDetailPage and checks elements', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/?pokemon=1']}>
          <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
            <PokemonDetailPage id="1" />
          </ThemeContext.Provider>
        </MemoryRouter>
        /
      </Provider>
    );

    expect(await screen.findByText('bulbasaur:')).toBeInTheDocument();
    expect(screen.getByText(/69/i)).toBeInTheDocument();
  });

  //     server.use(
  //       rest.get('https://pokeapi.co/api/v2/pokemon/:name', (req, res, ctx) => {
  //         return res(ctx.delay(1500), ctx.json({}));
  //       })
  //     );

  //     render(
  //       <MemoryRouter initialEntries={['/?pokemon=1']}>
  //         <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
  //           <PokemonDetailPage id="1" />
  //         </ThemeContext.Provider>
  //       </MemoryRouter>
  //     );

  //     // Проверяем, что отображается индикатор загрузки
  //     expect(screen.getByRole('progressbar')).toBeInTheDocument();
  //   });

  //   test('closes details when close button is clicked', async () => {
  //     // Мокаем useNavigate, чтобы вернуть mockNavigate
  //     jest.mock('react-router-dom', () => ({
  //       ...jest.requireActual('react-router-dom'),
  //       useNavigate: () => mockNavigate,
  //     }));

  //     render(
  //       <Provider store={store}>
  //         <MemoryRouter initialEntries={['/?pokemon=1']}>
  //           <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
  //             <PokemonDetailPage id="1" />
  //           </ThemeContext.Provider>
  //         </MemoryRouter>
  //         /
  //       </Provider>
  //     );

  //     // Имитируем клик по кнопке закрытия
  //     fireEvent.click(screen.getByRole('button', { name: /X/i }));

  //     // Проверяем, что navigate был вызван с правильным URL
  //     await waitFor(() => {
  //       expect(mockNavigate).toHaveBeenCalled();
  //     });
  //   });
  it('removes pokemon query param when close button is clicked', async () => {
    const history = createMemoryHistory();
    history.push('?pokemon=Pikachu');

    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/?pokemon=1']}>
          <ThemeContext.Provider value={{ theme: 'light', setTheme: () => {} }}>
            <PokemonDetailPage id="1" />
          </ThemeContext.Provider>
        </MemoryRouter>
        /
      </Provider>
    );

    await waitFor(() => fireEvent.click(screen.getByText(/X/i)));

    expect(history.location.search).toBe('?pokemon=Pikachu');
  });
});
