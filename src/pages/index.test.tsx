import { act, fireEvent, render, screen } from '@testing-library/react';
import MainPage from '../pages/index';
import { Provider } from 'react-redux';
import { useRouter } from 'next/router';
import store from '../store/store';
import '@testing-library/jest-dom';
import React from 'react';

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

const mockUseRouter = useRouter as jest.Mock;

describe('MainPage', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      query: { page: '1', pokemon: null },
      push: jest.fn(),
    });
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
