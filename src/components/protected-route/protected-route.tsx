import { profileSelector, userSelector } from '@slices';
import { ReactNode } from 'react';
import { RootState, useSelector } from '../../services/store';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Preloader } from '../ui/preloader';

type TProtectedRouteProps = {
  fromLoginPage?: boolean;
  children?: ReactNode | undefined;
};

export const ProtectedRoute = ({
  fromLoginPage,
  children
}: TProtectedRouteProps) => {
  const { isLoading, isLoggedIn } = useSelector(profileSelector);
  const location = useLocation();

  if (isLoading) {
    return <Preloader />;
  }

  if (!fromLoginPage && !isLoggedIn) {
    return <Navigate replace to={'/login'} />;
  }

  if (fromLoginPage && isLoggedIn) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
