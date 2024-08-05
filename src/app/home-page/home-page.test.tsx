import { act, fireEvent, render, screen } from '@testing-library/react';
import MainPage from './home-page';
import { Provider } from 'react-redux';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import store from '../../store/store';
import '@testing-library/jest-dom';
import React from 'react';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;
const mockUseSearchParams = useSearchParams as jest.Mock;
const mockUsePathname = usePathname as jest.Mock;

describe('MainPage', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
    });
    mockUseSearchParams.mockReturnValue({
      get: jest.fn().mockImplementation((key) => {
        if (key === 'page') return '1';
        if (key === 'pokemon') return null;
      }),
    });
    mockUsePathname.mockReturnValue('/some-path');
  });

  test('renders MainPage with mock data', async () => {
    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
    expect(await screen.findByText(/bulbasaur/i)).toBeInTheDocument();
  });

  test('updates term on input change', () => {
    render(
      <Provider store={store}>
        <MainPage />
      </Provider>
    );

    const input = screen.getByPlaceholderText(
      'Type pokemon name e.g. raticate'
    );

    fireEvent.change(input, { target: { value: 'Pikachu' } });

    expect(screen.getByDisplayValue('Pikachu')).toBeInTheDocument();
  });

  test('should throw an error when "Throw Error" button is clicked', () => {
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

    act(() => {
      render(
        <Provider store={store}>
          <MainPage />
        </Provider>
      );
    });

    expect(() => {
      fireEvent.click(screen.getByText(/Throw Error/i));
    }).toThrow('This is a test error.');
    spy.mockRestore();
  });
});
