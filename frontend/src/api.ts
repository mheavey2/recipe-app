// make the API call
const seachRecipes = async (searchTerm: string, page: number) => {
  const baseURL = new URL("http://localhost:300/api/recipes/search");
  baseURL.searchParams.append("searchTerm", searchTerm);
  baseURL.searchParams.append("page", page.toString());

  const response = await fetch(baseURL.toString());

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  return response.json();
};

export { seachRecipes };
