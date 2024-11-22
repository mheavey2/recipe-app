import "./App.css";
import { FormEvent, useState, useRef, useEffect } from "react";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import * as api from "./api";
import RecipeModal from "./components/RecipeModal";
import { AiOutlineSearch } from "react-icons/ai";

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
        // need to call favouriteRecipes.results rather than just favouriteRecipes because top level is object, .results contains the array we need with results (otherwise map() won't work)
        setFavouriteRecipes(favouriteRecipes.results);
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

  // handle adding favourite recipe
  const addFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await api.addFavouriteRecipe(recipe);
      //add selected recipe to the current array of favourites
      setFavouriteRecipes([...favouriteRecipes, recipe]);
    } catch (error) {
      console.log(error);
    }
  };

  //handle removing favourite recipe
  const removeFavouriteRecipe = async (recipe: Recipe) => {
    try {
      await api.removeFavouriteRecipe(recipe);
      //filter favourite recipes array for all bar the selected recipe
      const updatedRecipes = favouriteRecipes.filter(
        (favRecipe) => recipe.id !== favRecipe.id
      );
      //set the state to the newly filtered array
      setFavouriteRecipes(updatedRecipes);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <img src="/food-image.jpg" alt="image of two asian dishes" />
        <div className="title">Recipe Finder App</div>
      </div>
      <div className="tabs">
        <h1
          className={selectedTab === "search" ? "tab-active" : ""}
          onClick={() => setSelectedTab("search")}
        >
          Recipe Search
        </h1>
        <h1
          className={selectedTab === "favourites" ? "tab-active" : ""}
          onClick={() => setSelectedTab("favourites")}
        >
          Favourites
        </h1>
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

            <button type="submit">
              <AiOutlineSearch size={40} />
            </button>
          </form>
          {/* iterate over the recipes & display each recipe using the RecipeCard component*/}
          <div className="recipe-grid">
            {Array.isArray(recipes)
              ? recipes.map((recipe: Recipe) => {
                  // check if the current recipe being mapped is part of the favourite recipes array. returns boolean to the variable
                  const isFavourite = favouriteRecipes.some(
                    (favRecipe) => recipe.id === favRecipe.id
                  );

                  return (
                    <RecipeCard
                      key={recipe.id}
                      recipe={recipe}
                      isFavourite={isFavourite}
                      onClick={() => setSelectedRecipe(recipe)}
                      // add favourite when click the heart icon
                      onFavouriteButtonClick={
                        isFavourite ? removeFavouriteRecipe : addFavouriteRecipe
                      }
                    />
                  );
                })
              : null}
          </div>

          {/* button to display more recipes */}
          <button className="viewmore-button" onClick={handleViewMoreClick}>
            View More
          </button>
        </>
      )}

      {/* if favourite tab is selected, display favourites  */}
      {selectedTab === "favourites" && (
        <div className="recipe-grid">
          {Array.isArray(favouriteRecipes)
            ? favouriteRecipes.map((recipe: Recipe) => (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  // remove favourite when click the heart in the favourites tab
                  onFavouriteButtonClick={removeFavouriteRecipe}
                  isFavourite={true}
                />
              ))
            : null}
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
