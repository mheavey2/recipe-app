import "./App.css";
import React, { FormEvent, useState, useRef } from "react";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import * as api from "./api";
import RecipeModal from "./components/RecipeModal";

const App = () => {
  //manage state of search terms
  const [searchTerm, setSearchTerm] = useState<string>("");
  //manage state of recipes
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  // manage state of selected recipe
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );

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

  // keep track of current page without causing re-renders
  const pageNumber = useRef(1);

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
      {recipes.map((recipe: Recipe) => (
        <RecipeCard
          key={recipe.id}
          recipe={recipe}
          onClick={() => setSelectedRecipe(recipe)}
        />
      ))}
      {/* button to display more recipes */}
      <button className="viewmore" onClick={handleViewMoreClick}>
        View More
      </button>
      {/* if have selected recipe display the recipe modal */}
      {selectedRecipe ? <RecipeModal /> : null}
    </div>
  );
};

export default App;
