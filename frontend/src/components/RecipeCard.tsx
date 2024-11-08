// component to display the individual recipe data
import { Recipe } from "../types";

interface Props {
  recipe: Recipe;
  // define that the onClick prop thats passed to RecipeCard has to be a function that doesn't return anything
  onClick: () => void;
}

const RecipeCard = ({ recipe, onClick }: Props) => {
  return (
    <div className="recipe-card" onClick={onClick}>
      <img src={recipe.image} alt="recipe image" />
      <div className="recipe-card-title">
        <h3>{recipe.title}</h3>
        {/* <h6>{recipe.id}</h6> */}
      </div>
    </div>
  );
};

export default RecipeCard;
