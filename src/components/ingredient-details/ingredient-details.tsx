import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useParams } from 'react-router-dom';
import { useSelector } from '../../../src/services/store';
import { ingredientsSelector } from '@slices';

export const IngredientDetails: FC = () => {
  /** TODO: взять переменную из стора */
  const { id } = useParams();
  console.log(id);
  const ingredients = useSelector(ingredientsSelector);
  const ingredientData = ingredients.filter((it) => it._id === id)[0];
  console.log(ingredients);

  if (!ingredientData) {
    return <Preloader />;
  }

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
