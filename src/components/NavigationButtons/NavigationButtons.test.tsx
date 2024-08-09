import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NavigationButtons from './NavigationButtons';

describe('NavigationButtons', () => {
  test('renders Prev and Next buttons', () => {
    render(
      <NavigationButtons
        currentPage={1}
        totalPages={5}
        nextPage={jest.fn()}
        prevPage={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /Prev/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Next/i })).toBeInTheDocument();
  });

  test('Prev button is disabled on the first page', () => {
    render(
      <NavigationButtons
        currentPage={0}
        totalPages={5}
        nextPage={jest.fn()}
        prevPage={jest.fn()}
      />
    );

    const prevButton = screen.getByRole('button', { name: /Prev/i });
    expect(prevButton).toBeDisabled();
  });

  test('Next button is disabled on the last page', () => {
    render(
      <NavigationButtons
        currentPage={4}
        totalPages={5}
        nextPage={jest.fn()}
        prevPage={jest.fn()}
      />
    );

    const nextButton = screen.getByRole('button', { name: /Next/i });
    expect(nextButton).toBeDisabled();
  });

  test('clicking Prev button calls prevPage function', () => {
    const prevPageMock = jest.fn();
    render(
      <NavigationButtons
        currentPage={1}
        totalPages={5}
        nextPage={jest.fn()}
        prevPage={prevPageMock}
      />
    );

    const prevButton = screen.getByRole('button', { name: /Prev/i });
    fireEvent.click(prevButton);

    expect(prevPageMock).toHaveBeenCalledTimes(1);
  });

  test('clicking Next button calls nextPage function', () => {
    const nextPageMock = jest.fn();
    render(
      <NavigationButtons
        currentPage={1}
        totalPages={5}
        nextPage={nextPageMock}
        prevPage={jest.fn()}
      />
    );

    const nextButton = screen.getByRole('button', { name: /Next/i });
    fireEvent.click(nextButton);

    expect(nextPageMock).toHaveBeenCalledTimes(1);
  });
});
