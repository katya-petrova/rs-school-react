import React, { useState, useEffect } from 'react';
import './SearchInput.css';

interface SearchInputProps {
  term: string;
  onSearch: (term: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ term, onSearch }) => {
  const [inputValue, setInputValue] = useState(term);

  useEffect(() => {
    setInputValue(term);
  }, [term]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      onSearch(inputValue);
    }
  };

  const handleClick = () => {
    onSearch(inputValue);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  return (
    <div className="search">
      <input
        className="search-input"
        type="text"
        value={inputValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Type pokemon name e.g. raticate"
      />
      <button onClick={handleClick}>Search</button>
    </div>
  );
};

export default SearchInput;
