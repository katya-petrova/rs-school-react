import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import MainPage from './MainPage';
import userEvent from '@testing-library/user-event';
import store from '../../store/store';

test('renders MainPage with search input and theme toggle', () => {
  render(
    <Provider store={store}>
      <Router>
        <MainPage />
      </Router>
    </Provider>
  );

  expect(screen.getByText('Throw Error')).toBeInTheDocument();
});

test('searches for a pokemon and displays the result', async () => {
  render(
    <Provider store={store}>
      <Router>
        <MainPage />
      </Router>
    </Provider>
  );

  const input = screen.getByPlaceholderText('Type pokemon name e.g. raticate');
  userEvent.type(input, 'bulbasaur');
  userEvent.click(screen.getByRole('button', { name: /search/i }));

  await waitFor(() => {
    expect(screen.getByText(/bulbasaur/i)).toBeInTheDocument();
  });
});

test('throws an error when "Throw Error" button is clicked', () => {
  const { getByText } = render(
    <Provider store={store}>
      <Router>
        <MainPage />
      </Router>
    </Provider>
  );

  window.addEventListener('error', (evt) => {
    evt.preventDefault();
  });

  expect(() => {
    fireEvent.click(getByText('Throw Error'));
  }).toThrow();

  window.removeEventListener('error', (evt) => {
    evt.preventDefault();
  });
});
