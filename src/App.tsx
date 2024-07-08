import React from 'react'
import './App.css'
import MainPage from './views/MainPage/MainPage'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'

class App extends React.Component {
  render() {
    return (
      <ErrorBoundary>
        <div className="App">
          <MainPage />
        </div>
      </ErrorBoundary>
    )
  }
}

export default App
