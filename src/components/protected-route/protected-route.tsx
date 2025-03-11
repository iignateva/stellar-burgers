import React, { ReactElement, ReactNode } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, Navigate } from 'react-router-dom';
import { RootState } from 'src/services/store';
import { Preloader } from '../../components/ui';

export const ProtectedRoute = ({
  accessRoles,
  children
}: {
  accessRoles?: String[];
  children?: ReactNode | undefined;
}) => {
  const store = useSelector((store: RootState) => store);

  // if (isInit || isLoading) {
  //   return <Preloader />;
  // }

  // if (!accessRoles.includes('role')) {
  //   return <Navigate replace to='/sign-in' />;
  // }
  return children;
};
