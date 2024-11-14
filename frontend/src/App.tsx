import "./App.css";
import { FormEvent, useState, useRef, useEffect } from "react";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import * as api from "./api";
import RecipeModal from "./components/RecipeModal";

// new type that can only be either of two values 'search' or 'favourites' - helps manage state of selected tab
type Tabs = "search" | "favourites";

const App = () => {
  //manage state of search terms
  const [searchTerm, setSearchTerm] = useState<string>("");
  //manage state of recipes
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  // manage state of selected recipe
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );
  // manage state of selected tab
  const [selectedTab, setSelectedTab] = useState<Tabs>();
  // manage favourtie recipes state
  const [favouriteRecipes, setFavouriteRecipes] = useState<Recipe[]>([]);
  // keep track of current page without causing re-renders
  const pageNumber = useRef(1);

  // on load fetch favourite recipes
  useEffect(() => {
    const fetchFavouriteRecipes = async () => {
      try {
        const favouriteRecipes = await api.getFavouriteRecipes();
        setFavouriteRecipes(favouriteRecipes);
      } catch (error) {
        console.log(error);
      }
    };
    fetchFavouriteRecipes();
  }, []);

  // handle submitted search
  const handleSearchSubmit = async (event: FormEvent) => {
    // prevent default event behaviour of submitting the form
    event.preventDefault();

    try {
      const { results } = await api.searchRecipes(searchTerm, 1);
      //set state of recipes to returned
      setRecipes(results);
      // reset page number to 1 whenever new search term is entered
      pageNumber.current = 1;
    } catch (error) {
      console.log(error);
    }
  };

  // handle loading more recipes
  const handleViewMoreClick = async () => {
    try {
      const nextPage = pageNumber.current + 1;
      // get the next pages' recipes
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage);
      //update the recipes' state
      setRecipes((prevRecipes) => [...prevRecipes, ...nextRecipes.results]);
      //update the current page value
      pageNumber.current = nextPage;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="tabs">
        <h1 onClick={() => setSelectedTab("search")}>Recipe Search</h1>
        <h1 onClick={() => setSelectedTab("favourites")}>Favourites</h1>
      </div>

      {/* if search tab selected, display search field and associated returned search results when submitted */}
      {selectedTab === "search" && (
        <>
          {/* search bar form */}
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              required
              placeholder="Enter a search term ..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />

            <button type="submit">Submit</button>
          </form>
          {/* iterate over the recipes & display each recipe using the RecipeCard component*/}
          <div className="recipe-grid">
            {recipes.map((recipe: Recipe) => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onClick={() => setSelectedRecipe(recipe)}
              />
            ))}
          </div>

          {/* button to display more recipes */}
          <button className="viewmore" onClick={handleViewMoreClick}>
            View More
          </button>
        </>
      )}

      {/* if favourite tab is selected, display favourites  */}
      {selectedTab === "favourites" && (
        <div className="recipe-grid">
          {favouriteRecipes.map((recipe: Recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
            />
          ))}
        </div>
      )}
      {/* if have selected recipe display the recipe modal */}
      {selectedRecipe ? (
        <RecipeModal
          recipeId={selectedRecipe.id.toString()}
          onClose={() => setSelectedRecipe(undefined)}
        />
      ) : null}
    </div>
  );
};

export default App;
