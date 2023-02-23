import { createSlice } from '@reduxjs/toolkit';
import ClassFormat from '../../types/classFormat';

export const classFormatsSlice = createSlice({
  name: 'classFormats',
  initialState: [] as ClassFormat[],
  reducers: {
    addClassFormat (classFormatsState: ClassFormat[], classFormat: {payload: ClassFormat, type: string}) {
      classFormatsState.push(classFormat.payload);
      return classFormatsState;
    },
    setClassFormats (instrumentsState: ClassFormat[], classFormats: {payload: ClassFormat[], type: string}) {
      return classFormats.payload;
    }
  }
});
