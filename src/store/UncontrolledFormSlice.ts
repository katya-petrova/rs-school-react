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
  recentlySubmitted: false,

  countries: ['Belarus', 'Russia', 'Poland', 'Georgia'],
};

const uncontrolledFormSlice = createSlice({
  name: 'uncontrolledForm',
  initialState,
  reducers: {
    setFormData(state, action: PayloadAction<FormData['formData']>) {
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
export const { setFormData, setCountries, resetRecentlySubmitted } =
  uncontrolledFormSlice.actions;
export default uncontrolledFormSlice.reducer;
