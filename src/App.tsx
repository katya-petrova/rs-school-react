import React, { useState } from 'react';
import './App.css';
import MainPage from './views/MainPage/MainPage';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import NotFoundPage from './views/NotFoundPage/NotFoundPage';
import { ThemeContext } from './context/ThemeContext';
import { Provider } from 'react-redux';
import store from './store/store';

const App: React.FC = () => {
  const [theme, setTheme] = useState('dark');

  return (
    <Provider store={store}>
      <ThemeContext.Provider value={{ theme, setTheme }}>
        <Router>
          <ErrorBoundary>
            <div className="App">
              <Routes>
                <Route path="/" element={<MainPage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            </div>
          </ErrorBoundary>
        </Router>
      </ThemeContext.Provider>
    </Provider>
  );
};
export default App;
