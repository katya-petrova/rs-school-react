import { configureStore } from '@reduxjs/toolkit';
import selectedPokemonsSlice from './selectedPokemonsSlice';
import currentPageSlice from './currentPageSlice';

const store = configureStore({
  reducer: {
    selectedPokemons: selectedPokemonsSlice,
    page: currentPageSlice,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
