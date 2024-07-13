import React from 'react'
import './App.css'
import MainPage from './views/MainPage/MainPage'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import { BrowserRouter as Router } from 'react-router-dom'

const App: React.FC = () => {
  return (
    <Router>
      <ErrorBoundary>
        <div className="App">
          <MainPage />
        </div>
      </ErrorBoundary>
    </Router>
  )
}

export default App
