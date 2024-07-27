import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotFoundPage from './NotFoundPage';
import { Router } from 'react-router';
import { createMemoryHistory } from '@remix-run/router';

test('renders NotFoundPage and checks elements', () => {
  const history = createMemoryHistory();

  render(
    <Router location={history.location} navigator={history}>
      <NotFoundPage />
    </Router>
  );

  expect(screen.getByAltText('Not Found')).toBeInTheDocument();
  expect(screen.getByText('Page is not found')).toBeInTheDocument();

  const button = screen.getByRole('button', { name: /Go back to search/i });
  expect(button).toBeInTheDocument();
});

test('navigates to home page when button is clicked', () => {
  const history = createMemoryHistory();

  render(
    <Router location={history.location} navigator={history}>
      <NotFoundPage />
    </Router>
  );

  fireEvent.click(screen.getByRole('button', { name: /Go back to search/i }));

  expect(history.location.pathname).toBe('/');
});
