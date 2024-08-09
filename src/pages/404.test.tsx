import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotFoundPage from './404';
import { useRouter } from 'next/router';

// Мокаем хук useRouter из next/router
jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('NotFoundPage', () => {
  it('renders NotFoundPage and checks elements', () => {
    // Мокаем использование useRouter
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    render(<NotFoundPage />);

    // Проверяем наличие элементов
    expect(screen.getByAltText('Not Found')).toBeInTheDocument();
    expect(screen.getByText('Page is not found')).toBeInTheDocument();

    const button = screen.getByRole('button', { name: /Go back to search/i });
    expect(button).toBeInTheDocument();
  });

  it('navigates to home page when button is clicked', () => {
    // Мокаем использование useRouter
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });

    render(<NotFoundPage />);

    // Имитируем клик по кнопке
    fireEvent.click(screen.getByRole('button', { name: /Go back to search/i }));

    // Проверяем, что вызвана функция перехода на главную страницу
    expect(pushMock).toHaveBeenCalledWith('/');
  });
});
