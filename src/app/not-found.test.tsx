import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotFoundPage from './not-found';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('NotFoundPage', () => {
  it('renders NotFoundPage and checks elements', () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    render(<NotFoundPage />);

    expect(screen.getByAltText('Not Found')).toBeInTheDocument();
    expect(screen.getByText('Page is not found')).toBeInTheDocument();
  });
});
