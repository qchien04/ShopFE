import { useAuth as useAuthQuery } from '../hooks/Auth/useAuth';
import { Spin } from 'antd';
import { useEffect, useState, type ReactNode } from 'react';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { isLoading } = useAuthQuery();

  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoading) setReady(true);
  }, [isLoading]);

  if (!ready) return <Spin />; 

  return <>{children}</>;
};
