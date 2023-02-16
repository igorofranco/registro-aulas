import { configureStore } from '@reduxjs/toolkit';
import { instrumentsSlice } from '../features/instruments/instrumentsSlice';

export const instrumentsStore = configureStore({
  reducer: instrumentsSlice.reducer
});
