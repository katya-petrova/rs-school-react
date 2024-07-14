import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';
import PokemonDetailPage from './PokemonDetailsPage';
import '@testing-library/jest-dom';

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
});

test('Check that a loading indicator is displayed while fetching data', () => {
  fetchMock.mockResponseOnce(() => new Promise(() => {}));

  render(
    <BrowserRouter>
      <PokemonDetailPage id="1" />
    </BrowserRouter>
  );

  expect(screen.getByRole('progressbar')).toBeInTheDocument();
});
