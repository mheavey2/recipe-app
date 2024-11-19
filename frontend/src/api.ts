import { Recipe } from "./types";

// make the API call to search for recipes
export const searchRecipes = async (searchTerm: string, page: number) => {
  const baseURL = new URL("http://localhost:3000/api/recipe/search");
  baseURL.searchParams.append("searchTerm", searchTerm);
  baseURL.searchParams.append("page", page.toString());

  const response = await fetch(baseURL.toString());

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  return response.json();
};

//make API call to get selected recipes' summary
export const getRecipeSummary = async (recipeId: string) => {
  const url = new URL(`http://localhost:3000/api/recipe/${recipeId}/summary`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

// get favourite recipes
export const getFavouriteRecipes = async () => {
  const url = new URL("http://localhost:3000/api/recipe/favourite");
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return await response.json();
};

// add favourite recipe i.e create a new entry in the favourites database

export const addFavouriteRecipe = async (recipe: Recipe) => {
  const url = new URL("http://localhost:3000/api/recipe/favourite");
  //the body of the object to create
  const body = {
    recipeId: recipe.id,
  };

  //the post fetch request
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    //convert body object to string for use in the request
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
};

//remove favourite recipe

export const removeFavouriteRecipe = async (recipe: Recipe) => {
  const url = new URL("http://localhost:3000/api/recipe/favourite");
  //the body of the object to remove
  const body = {
    recipeId: recipe.id,
  };

  //the delete fetch request
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    //convert body object to string for use in the request
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
};
