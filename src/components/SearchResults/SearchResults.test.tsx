import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import SearchResults from './SearchResults';
import { SearchResultsProps } from '../../interfaces/results';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    search: '',
  }),
  useNavigate: jest.fn(),
}));

const mockData: SearchResultsProps = {
  results: [
    {
      id: 'test-id',
      name: 'Test Pokemon',
      weight: '1',
      image: 'http://example.com/test-image.png',
      back_view: 'http://example.com/test-back-view.png',
      abilities: [{ ability: { name: 'run' } }, { ability: { name: 'jump' } }],
      types: [{ type: { name: 'fire' } }, { type: { name: 'flying' } }],
      sprites: {
        front_shiny: 'test',
        back_shiny: 'test1',
      },
      height: '1',
    },
  ],
};

test('renders SearchResults with given properties', () => {
  render(
    <Router>
      <SearchResults {...mockData} />
    </Router>
  );

  expect(screen.getByText(/Test Pokemon/i)).toBeInTheDocument();
});

test('renders Pokemon image correctly', () => {
  render(
    <Router>
      <SearchResults {...mockData} />
    </Router>
  );

  const pokemonImage = screen.getByAltText('');
  expect(pokemonImage).toHaveAttribute(
    'src',
    'http://example.com/test-image.png'
  );
});

test('navigates correctly on background click', () => {
  const navigate = jest.fn();
  (useNavigate as jest.Mock).mockReturnValue(navigate);

  const { container } = render(
    <Router>
      <SearchResults {...mockData} />
    </Router>
  );

  fireEvent.click(container.firstChild as Element);

  expect(navigate).toHaveBeenCalledWith('?');
});

test('displays Pokemon abilities and types correctly', () => {
  render(
    <Router>
      <SearchResults {...mockData} />
    </Router>
  );

  const paragraphs = screen.getAllByRole('paragraph');

  expect(paragraphs).toHaveLength(4);

  expect(paragraphs[0]).toHaveTextContent(/abilities:\s*run,\s*jump/i);
  expect(paragraphs[1]).toHaveTextContent(/types:\s*fire,\s*flying/i);
});
