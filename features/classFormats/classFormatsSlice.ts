import { createSlice } from '@reduxjs/toolkit';
import ClassFormat from '../../types/classFormat';

export const classFormatsSlice = createSlice({
  name: 'classFormats',
  initialState: [] as ClassFormat[],
  reducers: {
    addClassFormat (classFormatsState: ClassFormat[], student: {payload: ClassFormat, type: string}) {
      classFormatsState.push(student.payload);
      return classFormatsState;
    }
  }
});
