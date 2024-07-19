import { configureStore } from '@reduxjs/toolkit';
import selectedPokemonsSlice from './selectedPokemonsSlice';

const store = configureStore({
  reducer: {
    selectedPokemons: selectedPokemonsSlice,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
