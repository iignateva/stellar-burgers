import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds, feedsSelector } from '@slices';

export const Feed: FC = () => {
  const feeds = useSelector(feedsSelector);
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = feeds.orders;

  useEffect(() => {
    dispatch(getFeeds());
  }, []);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={() => dispatch(getFeeds())} />;
};
