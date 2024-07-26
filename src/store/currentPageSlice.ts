import { createSlice } from '@reduxjs/toolkit';

const currentPageSlice = createSlice({
  name: 'page',
  initialState: 0,
  reducers: {
    setPage: (state, action) => action.payload,
  },
});

export const { setPage } = currentPageSlice.actions;
export default currentPageSlice.reducer;
