import "./App.css";
import React, { FormEvent, useState, useRef } from "react";
import { Recipe } from "./types";
import RecipeCard from "./components/RecipeCard";
import * as api from "./api";

const App = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  // handle submitted search
  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      const { results } = await api.searchRecipes(searchTerm, 1);
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
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage);
      setRecipes((prevRecipes) => [...prevRecipes, ...nextRecipes.results]);
      pageNumber.current = nextPage;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
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
      {recipes.map((recipe: Recipe) => (
        <RecipeCard key={recipe.id} recipe={recipe} />
      ))}
      <button className="viewmore" onClick={handleViewMoreClick}>
        View More
      </button>
    </div>
  );
};

export default App;
