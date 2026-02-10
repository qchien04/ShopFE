import { useQuery } from '@tanstack/react-query';

import { useEffect } from 'react';
import { setUser } from '../../features/auth/authSlice';
import { userApi } from '../../api/user.api';
import type { UserAccount } from '../../types';
import { useAppDispatch } from '../../app/store';

export const useAuth = () => {
  const dispatch = useAppDispatch();

  const token = localStorage.getItem('jwtToken');

  const query = useQuery<UserAccount, Error>({
    queryKey: ['me'],
    queryFn: userApi.getMyProfile,
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (query.data) {
      dispatch(setUser(query.data));
    }
  }, [query.data, dispatch]);

  return {
    user: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error ?? null,
    refetch: query.refetch
  };
};
