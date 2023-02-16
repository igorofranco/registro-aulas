import { createSlice } from '@reduxjs/toolkit';
import Instrument from '../../types/instrument';

export const instrumentsSlice = createSlice({
  name: 'instruments',
  initialState: [] as Instrument[],
  reducers: {
    addClassFormat (instrumentsState: Instrument[], student: {payload: Instrument, type: string}) {
      instrumentsState.push(student.payload);
      return instrumentsState;
    }
  }
});
