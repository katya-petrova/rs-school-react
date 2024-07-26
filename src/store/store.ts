import { configureStore } from '@reduxjs/toolkit';
import selectedPokemonsSlice from './selectedPokemonsSlice';
import currentPageSlice from './currentPageSlice';
import { pokemonApi } from '../services/pokemonApi';

const store = configureStore({
  reducer: {
    selectedPokemons: selectedPokemonsSlice,
    page: currentPageSlice,
    [pokemonApi.reducerPath]: pokemonApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(pokemonApi.middleware),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
