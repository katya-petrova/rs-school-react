import React from 'react'
import './App.css'
import MainPage from './views/MainPage/MainPage'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <div className="App">
        <MainPage />
      </div>
    </ErrorBoundary>
  )
}

export default App
