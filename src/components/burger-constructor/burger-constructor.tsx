import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../../src/services/store';
import { constructorItemsSelector, createOrder, orderRequestDone, profileSelector, sentOrderRequest } from '@slices';
import { Link, useNavigate } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems = useSelector(constructorItemsSelector);
  const profile = useSelector(profileSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const orderRequest = constructorItems.orderRequest;
  const orderModalData = constructorItems.orderModalData;

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (profile.isLoggedIn) {
      dispatch(sentOrderRequest())
      dispatch(createOrder(constructorItems.ingredients.map(it => it._id)));
    } else {
     navigate('/login');
    }
  };

  const closeOrderModal = () => { 
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
