import { createSlice } from '@reduxjs/toolkit';
import User from '../../types/user';

const unloggedUser: User = {
  id: undefined,
  name: '',
  email: '',
  token: undefined
};

export const userSlice = createSlice({
  name: 'user',
  initialState: unloggedUser,
  reducers: {
    setUser (userState: User, newState): User {
      if (typeof window !== 'undefined') {
        localStorage.setItem('user', JSON.stringify(newState.payload));
      }
      return newState.payload as User;
    },
    logout (): User {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('user');
      }
      return unloggedUser;
    },
    autoLoginByLocalStorage (): User {
      if (typeof window === 'undefined') {
        return unloggedUser;
      }
      const storedUserAsString = localStorage.getItem('user');
      if (!storedUserAsString) return unloggedUser;
      return JSON.parse(storedUserAsString) as User;
    }
  }
});
