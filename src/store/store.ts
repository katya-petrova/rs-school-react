import { configureStore } from '@reduxjs/toolkit';
import uncontrolledFormReducer from './UncontrolledFormSlice';
import controlledFormReducer from './ControlledFormSlice';

const store = configureStore({
  reducer: {
    controlledForm: controlledFormReducer,
    uncontrolledForm: uncontrolledFormReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
