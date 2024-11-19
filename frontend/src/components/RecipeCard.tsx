// component to display the individual recipe data
import { Recipe } from "../types";
// import react-icons heart icon
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface Props {
  recipe: Recipe;
  isFavourite: boolean;
  // define that the onClick prop and onFavouriteButtonClick thats passed to RecipeCard has to be a function that doesn't return anything
  onClick: () => void;
  onFavouriteButtonClick: (recipe: Recipe) => void;
}

const RecipeCard = ({
  recipe,
  onClick,
  onFavouriteButtonClick,
  isFavourite,
}: Props) => {
  return (
    <div className="recipe-card" onClick={onClick}>
      <img src={recipe.image} alt="recipe image" />
      <div className="recipe-card-title">
        <span
          onClick={(event) => {
            // ignore the click event on the recipe-card parent element
            event.stopPropagation();
            onFavouriteButtonClick(recipe);
          }}
        >
          {/* hill heart icon with colour if its a favourite recipe, else leave heart empty */}
          {isFavourite ? (
            <AiFillHeart size={25} color="red" />
          ) : (
            <AiOutlineHeart size={25} />
          )}
        </span>
        <h3>{recipe.title}</h3>
        {/* <h6>{recipe.id}</h6> */}
      </div>
    </div>
  );
};

export default RecipeCard;
