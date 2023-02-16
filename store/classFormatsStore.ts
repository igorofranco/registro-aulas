import { configureStore } from '@reduxjs/toolkit';
import { classFormatsSlice } from '../features/classFormats/classFormatsSlice';

export const classFormatsStore = configureStore({
  reducer: classFormatsSlice.reducer
});
