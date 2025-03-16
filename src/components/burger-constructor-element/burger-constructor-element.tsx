import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { useDispatch } from '../../services/store';
import { deleteIngredient, moveDownIngredient, moveUpIngredient } from '@slices';


export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
  
    const dispatch = useDispatch();

    const handleMoveDown = () => {dispatch(moveDownIngredient(index));};

    const handleMoveUp = () => {dispatch(moveUpIngredient(index))};

    const handleClose = () => { dispatch(deleteIngredient(index))};

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={handleMoveUp}
        handleMoveDown={handleMoveDown}
        handleClose={handleClose}
      />
    );
  }
);
