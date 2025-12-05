// Auth slice for Redux

import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { AuthUser, AuthState } from '../../types/common.types';

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('authToken'),
  isAuthenticated: !!localStorage.getItem('authToken'),
  isLoading: false,
};

// Try to restore user from localStorage
const savedUser = localStorage.getItem('authUser');
if (savedUser) {
  try {
    initialState.user = JSON.parse(savedUser);
  } catch (e) {
    console.error('Failed to parse saved user', e);
  }
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthUser: (state, action: PayloadAction<AuthUser>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('authUser', JSON.stringify(action.payload));
    },
    setAuthToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem('authToken', action.payload);
    },
    clearAuth: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authUser');
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setAuthUser, setAuthToken, clearAuth, setLoading } = authSlice.actions;
export default authSlice.reducer;

