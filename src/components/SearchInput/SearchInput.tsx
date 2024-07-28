import React from 'react'
import './SearchInput.css'

interface SearchInputProps {
  term: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSearch: () => void
}

const SearchInput: React.FC<SearchInputProps> = (props) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      props.onSearch()
    }
  }

  return (
    <div className="search">
      <input
        className="search-input"
        type="text"
        value={props.term}
        onChange={props.onChange}
        onKeyDown={handleKeyDown}
        placeholder="Type pokemon name e.g. raticate"
      />
      <button onClick={props.onSearch}>Search</button>
    </div>
  )
}

export default SearchInput
