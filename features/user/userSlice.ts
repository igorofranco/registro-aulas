import { createSlice } from '@reduxjs/toolkit';
import User from '../../types/user';

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    name: '',
    email: ''
  } as User,
  reducers: {
    setUser (userState: User, newState): User {
      return newState.payload as User;
    },
    logout (): User {
      return {
        name: '',
        email: '',
        token: undefined
      };
    }
  }
});
