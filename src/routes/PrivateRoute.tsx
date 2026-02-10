import { Navigate } from "react-router-dom";
import type { FC, ReactNode } from "react";
import { useAppSelector, type RootState } from "../app/store";

const PrivateRoute: FC<{ children: ReactNode }> = ({ children }) => {
  const {isAuthenticated } = useAppSelector((state:RootState)=>state.auth);
  console.log(isAuthenticated?"co":"khong")
  if (!isAuthenticated) return <Navigate to="/login" />;
  
  return <>{children}</>;
};

export default PrivateRoute;
