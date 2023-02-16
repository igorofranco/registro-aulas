import { configureStore } from '@reduxjs/toolkit';
import { studentsSlice } from '../features/student/studentsSlice';

export default configureStore({
  reducer: studentsSlice.reducer
});
