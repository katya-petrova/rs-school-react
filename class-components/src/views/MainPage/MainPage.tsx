import React from "react";
import "./MainPage.css";
import SearchInput from "../../components/SearchInput/SearchInput";
import SearchResults from "../../components/SearchResults/SearchResults";
import { fetchByName, fetchPokemons } from "../../services/apiService";
import { Result } from "../../interfaces/results";

interface MainPageState {
  term: string;
  results: Result[];
  isLoading: boolean;
  shouldThrowError: boolean;
}

class MainPage extends React.Component<Record<string, never>, MainPageState> {
  constructor(props: Record<string, never>) {
    super(props);
    this.state = {
      term: "",
      results: [],
      isLoading: false,
      shouldThrowError: false,
    };
  }

  componentDidMount() {
    const term = localStorage.getItem("term");
    if (term) {
      this.setState({ term });
      this.search(term);
    } else {
      this.loadAllPokemons();
    }
  }

  loadAllPokemons = async () => {
    this.setState({ isLoading: true });
    const results = await fetchPokemons();
    this.setState({ results: results, isLoading: false });
  };

  loadPokemonByName = async (name: string) => {
    this.setState({ isLoading: true });
    const results = await fetchByName(name);
    this.setState({ results: results!, isLoading: false });
  };

  search = (term: string) => {
    this.setState({ results: [], isLoading: true });
    this.loadPokemonByName(term);
  };

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ term: event.target.value });
  };

  handleButtonClick = () => {
    localStorage.setItem("term", this.state.term);
    this.search(this.state.term);
  };

  throwError = () => {
    this.setState({ shouldThrowError: true });
  };

  render() {
    if (this.state.shouldThrowError) {
      throw new Error("This is a test error.");
    }
    return (
      <div>
        <div className="top-panel">
          <section>
            <SearchInput
              term={this.state.term}
              onChange={this.handleInputChange}
              onSearch={this.handleButtonClick}
            />
          </section>

          <button onClick={this.throwError}>Throw Error</button>
        </div>
        <section>
          {this.state.isLoading ? (
            <div className="spinner"></div>
          ) : (
            <SearchResults results={this.state.results} />
          )}
        </section>
      </div>
    );
  }
}

export default MainPage;
