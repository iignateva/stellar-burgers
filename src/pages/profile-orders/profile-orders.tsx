import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { feedsSelector, getIngredients, getUserOrders } from '@slices';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(feedsSelector).profileOrders;

  useEffect(() => {
    dispatch(getUserOrders());
    dispatch(getIngredients());
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
