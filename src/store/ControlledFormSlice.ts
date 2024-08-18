import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FormData {
  formData: {
    name: string | null;
    age: number | null;
    email: string | null;
    password: string | null;
    gender: string | null;
    terms: boolean;
    image: string | null;
    country: string | null;
  };
  countries: string[];
  recentlySubmitted: boolean;
}

const initialState: FormData = {
  formData: {
    name: null,
    age: null,
    email: null,
    password: null,
    gender: null,
    terms: false,
    image: null,
    country: null,
  },
  countries: ['Belarus', 'Russia', 'Poland', 'Georgia'],
  recentlySubmitted: false,
};

const controlledFormSlice = createSlice({
  name: 'controlledForm',
  initialState,
  reducers: {
    updateFormData(state, action: PayloadAction<FormData['formData']>) {
      state.formData = action.payload;
      state.recentlySubmitted = true;
      const country = action.payload.country;
      if (country && !state.countries.includes(country)) {
        state.countries.push(country);
      }
    },
    setCountries(state, action: PayloadAction<string[]>) {
      state.countries = action.payload;
    },
    resetRecentlySubmitted(state) {
      state.recentlySubmitted = false;
    },
  },
});

export const { updateFormData, setCountries, resetRecentlySubmitted } =
  controlledFormSlice.actions;
export default controlledFormSlice.reducer;
