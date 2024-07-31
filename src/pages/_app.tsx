import { AppProps } from 'next/app';
import { Provider } from 'react-redux';
import { ThemeContext } from '../context/ThemeContext';
import { useState } from 'react';
import store from '../store/store';
import '../../src/index.css';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

const MyApp = ({ Component, pageProps }: AppProps) => {
  const [theme, setTheme] = useState('dark');

  return (
    <Provider store={store}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <ErrorBoundary>
          <Component {...pageProps} />
        </ErrorBoundary>
      </ThemeContext.Provider>
    </Provider>
  );
};

export default MyApp;
