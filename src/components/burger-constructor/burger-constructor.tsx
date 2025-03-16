import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../../src/services/store';
import {
  clearConstructorItems,
  constructorItemsSelector,
  createOrder,
  orderRequestDone,
  orderRequestSelector,
  profileSelector,
  sentOrderRequest
} from '@slices';
import { useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(constructorItemsSelector);
  const { orderModalData, orderRequest } = useSelector(orderRequestSelector);
  const profile = useSelector(profileSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (profile.isLoggedIn) {
      dispatch(sentOrderRequest());
      dispatch(createOrder(constructorItems.ingredients.map((it) => it._id)));
    } else {
      navigate('/login');
    }
  };

  const closeOrderModal = () => {
    dispatch(clearConstructorItems());
    dispatch(orderRequestDone());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
