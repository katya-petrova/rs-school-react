import React from 'react';
import './App.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage/MainPage';
import UncontrolledFormPage from './pages/UncontrolledFormPage/UncontrolledFormPage';
import { Provider } from 'react-redux';
import store from './store/store';
import ReactHookFormPage from './pages/ReactHookFormPage/ReactHookFormPage';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <Router>
        <ErrorBoundary>
          <div className="App">
            <Routes>
              <Route path="/" element={<MainPage />} />
              <Route
                path="/uncontrolled-form"
                element={<UncontrolledFormPage />}
              />
              <Route path="/react-hook-form" element={<ReactHookFormPage />} />
            </Routes>
          </div>
        </ErrorBoundary>
      </Router>
    </Provider>
  );
};

export default App;
