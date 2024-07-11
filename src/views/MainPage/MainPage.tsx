import React, { useState, useEffect, useCallback } from 'react'
import './MainPage.css'
import SearchInput from '../../components/SearchInput/SearchInput'
import SearchResults from '../../components/SearchResults/SearchResults'
import { fetchByName, fetchPokemons } from '../../services/apiService'
import { Result } from '../../interfaces/results'

const MainPage: React.FC = () => {
  const [term, setTerm] = useState<string>(localStorage.getItem('term') || '')
  const [results, setResults] = useState<Result[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [shouldThrowError, setShouldThrowError] = useState<boolean>(false)

  const search = useCallback((term: string) => {
    setResults([])
    setIsLoading(true)
    loadPokemonByName(term)
  }, [])

  useEffect(() => {
    const loadResults = async () => {
      if (term) {
        search(term)
      } else {
        loadAllPokemons()
      }
    }

    loadResults()
  }, [term, search])

  const loadAllPokemons = async () => {
    setIsLoading(true)
    const results = await fetchPokemons()
    setResults(results)
    setIsLoading(false)
  }

  const loadPokemonByName = async (name: string) => {
    setIsLoading(true)
    const results = await fetchByName(name)
    setResults(results!)
    setIsLoading(false)
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(event.target.value.trim())
  }

  const handleButtonClick = () => {
    localStorage.setItem('term', term)
    search(term)
  }

  const throwError = () => {
    setShouldThrowError(true)
  }

  if (shouldThrowError) {
    throw new Error('This is a test error.')
  }

  return (
    <div>
      <div className="top-panel">
        <section>
          <SearchInput
            term={term}
            onChange={handleInputChange}
            onSearch={handleButtonClick}
          />
        </section>

        <button onClick={throwError}>Throw Error</button>
      </div>
      <section>
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <SearchResults results={results} />
        )}
      </section>
    </div>
  )
}

export default MainPage
