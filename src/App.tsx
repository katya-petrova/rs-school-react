import React from 'react';
import './App.css';
import MainPage from './views/MainPage/MainPage';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import NotFoundPage from './views/NotFoundPage/NotFoundPage';

const App: React.FC = () => {
  return (
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
  );
};

export default App;
