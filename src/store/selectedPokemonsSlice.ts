import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Result } from '../interfaces/results';

export interface SelectedPokemonsState {
  selectedPokemons: Result[];
}

const initialState: SelectedPokemonsState = {
  selectedPokemons: [],
};

const selectedPokemonsSlice = createSlice({
  name: 'selectedPokemons',
  initialState,
  reducers: {
    add: (state, action: PayloadAction<Result>) => {
      state.selectedPokemons.push(action.payload);
    },
    remove: (state, action: PayloadAction<Result>) => {
      state.selectedPokemons = state.selectedPokemons.filter(
        (pokemon) => pokemon.name !== action.payload.name
      );
    },
    removeAll: (state) => {
      state.selectedPokemons = [];
    },
  },
});

export const { add, remove, removeAll } = selectedPokemonsSlice.actions;
export default selectedPokemonsSlice.reducer;
