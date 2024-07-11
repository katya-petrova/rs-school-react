import React from 'react'
import './SearchResults.css'
import { Result } from '../../interfaces/results'

interface SearchResultsProps {
  results: Result[]
}

const SearchResults: React.FC<SearchResultsProps> = (props) => {
  return (
    <div className="search-results">
      {props.results.map((result) => {
        return (
          <div key={result.id} className="pokemon-item">
            <div className="pokemon-name">
              <h2>{result.name}</h2>
              <img src={result.image} alt="" />
            </div>

            <div className="pokemon-description">
              <p>
                <b>Abilities:</b>
                {result.abilities
                  .map((ability) => ability.ability.name)
                  .join(', ')}
              </p>
              <p>
                <b>Types:</b>
                {result.types.map((type) => type.type.name).join(', ')}
              </p>
              <p>
                <b>Height:</b> {result.height}
              </p>
              <p>
                <b>Weight:</b> {result.weight}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default SearchResults
