// api key as saved in .env file
const apiKey = process.env.API_KEY;

// take in users' search term and the page the front end is requesting as parameters
export const searchRecipes = async (searchTerm: string, page: number) => {
  // check if api exists before trying to do anything else
  if (!apiKey) {
    throw new Error("API key not found");
  }
  //   using URL object makes things like parameters and path parameters easier
  const url = new URL("https://api.spoonacular.com/recipes/complexSearch");

  const queryParams = {
    apiKey,
    query: searchTerm,
    number: "10",
    // offset calculated based of page number requested. multiple by 10 because each page will have 10 results as specifiied by 'number' key
    offset: (page * 10).toString(),
  };
  url.search = new URLSearchParams(queryParams).toString();

  try {
    const searchResponse = await fetch(url);
    const resultsJson = await searchResponse.json();
    return resultsJson;
  } catch (error) {
    console.log(error);
  }
};

//fetch recipe summary
export const getRecipeSummary = async (recipeId: string) => {
  if (!apiKey) {
    throw new Error("API key not found");
  }

  const url = new URL(
    `https://api.spoonacular.com/recipes/${recipeId}/summary`
  );

  const params = {
    apiKey: apiKey,
  };
  url.search = new URLSearchParams(params).toString();

  const response = await fetch(url);
  const json = await response.json();
  return json;
};
