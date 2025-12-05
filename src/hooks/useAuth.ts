// Authentication hooks with React Query

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authApi } from '../services/api/auth.api';
import type { LoginRequest } from '../services/api/auth.api';
import { useDispatch } from 'react-redux';
import { setAuthUser, clearAuth } from '../store/slices/auth.slice';

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginRequest) => authApi.login(credentials),
    onSuccess: (data) => {
      localStorage.setItem('authToken', data.token);
      localStorage.setItem('refreshToken', data.refreshToken);
      // Fetch current user
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('authUser');
      dispatch(clearAuth());
      queryClient.clear();
    },
  });
};

export const useCurrentUser = () => {
  const dispatch = useDispatch();
  const token = localStorage.getItem('authToken');

  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const user = await authApi.getCurrentUser();
      dispatch(setAuthUser(user));
      localStorage.setItem('authUser', JSON.stringify(user));
      return user;
    },
    enabled: !!token,
    retry: false,
  });
};

