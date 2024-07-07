import React from "react";
import "./SearchInput.css";

interface SearchInputProps {
  term: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearch: () => void;
}

class SearchInput extends React.Component<SearchInputProps> {
  render() {
    return (
      <div className="search">
        <input
          className="search-input"
          type="text"
          value={this.props.term}
          onChange={this.props.onChange}
          placeholder="Type pokemon name e.g. raticate"
        />
        <button onClick={this.props.onSearch}>Search</button>
      </div>
    );
  }
}

export default SearchInput;
