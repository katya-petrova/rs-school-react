'use client';

import { Provider } from 'react-redux';
import { ThemeContext } from '../context/ThemeContext';
import { useState } from 'react';
import store from '../store/store';
import '../../src/app/index.css';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';
import MainPage from './home-page/home-page';
import './index.css';

const MyApp = () => {
  const [theme, setTheme] = useState('dark');

  return (
    <Provider store={store}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <ErrorBoundary>
          <MainPage />
        </ErrorBoundary>
      </ThemeContext.Provider>
    </Provider>
  );
};

export default MyApp;
