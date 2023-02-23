import { createSlice } from '@reduxjs/toolkit';
import Instrument from '../../types/instrument';

export const instrumentsSlice = createSlice({
  name: 'instruments',
  initialState: [] as Instrument[],
  reducers: {
    addInstrument (instrumentsState: Instrument[], instrument: {payload: Instrument, type: string}) {
      instrumentsState.push(instrument.payload);
      return instrumentsState;
    },
    setInstruments (instrumentsState: Instrument[], instruments: {payload: Instrument[], type: string}) {
      return instruments.payload;
    }
  }
});
