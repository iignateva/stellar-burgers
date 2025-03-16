import { FC, useEffect } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from '../../../src/services/store';
import { getIngredients, ingredientsSelector } from '@slices';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();
  const dispatch = useDispatch();
  const ingredients = useSelector(ingredientsSelector);
  const ingredientData = ingredients.filter((it) => it._id === id)[0];

  useEffect(() => {
    dispatch(getIngredients());
  }, []);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
