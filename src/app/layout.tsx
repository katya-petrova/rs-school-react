'use client';
import { Provider } from 'react-redux';
import { ThemeContext } from '../context/ThemeContext';
import { useState } from 'react';
import store from '../store/store';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import './index.css';

export default function RoыotLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState('dark');

  return (
    <html lang="en">
      <body>
        <Provider store={store}>
          <ThemeContext.Provider value={{ theme, setTheme }}>
            <ErrorBoundary>{children}</ErrorBoundary>
          </ThemeContext.Provider>
        </Provider>
      </body>
    </html>
  );
}
