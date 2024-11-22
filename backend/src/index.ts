import express from "express";
import cors from "cors";
import "dotenv/config";
import * as RecipeAPI from "./recipe-api";
import { PrismaClient } from "@prisma/client";

const app = express();
const prismaClient = new PrismaClient();

app.use(express.json());
app.use(cors());

//route to handle requests to recipe search endpoint
app.get("/api/recipe/search", async (req, res) => {
  const searchTerm = req.query.searchTerm as string;
  const page = parseInt(req.query.page as string);
  const results = await RecipeAPI.searchRecipes(searchTerm, page);

  return res.json(results);
});

// route to handle requests to recipe summary endpoint
// :recipeId means its a path param
app.get("/api/recipe/:recipeId/summary", async (req, res) => {
  const recipeId = req.params.recipeId;
  const result = await RecipeAPI.getRecipeSummary(recipeId);
  return res.json(result);
});

// create post endpoint using PrismaClient to handle posting operations on the favourite recipes database
app.post("/api/recipe/favourite", async (req, res) => {
  const recipeId = req.body.recipeId;

  try {
    // create favourite recipe row item with the recipe id in the database
    const favouriteRecipe = await prismaClient.favouriteRecipes.create({
      data: {
        recipeId: recipeId,
      },
    });
    // return created status and the recipe created by Prisma back to the frontend
    return res.status(201).json(favouriteRecipe);
  } catch (error) {
    // if there's an error, log it to the console and return an error status and generic message to the frontend
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something went wrong in post operation." });
  }
});

// create get endpoint to return favourite from database
app.get("/api/recipe/favourite", async (req, res) => {
  try {
    // get the recipe ids saved in the database
    const recipes = await prismaClient.favouriteRecipes.findMany();
    // iterate over all the returned recipe ids and convert them to string values stored in an array
    const recipeIds = recipes.map((recipe) => recipe.recipeId.toString());
    const favourites = await RecipeAPI.getFavouriteRecipesById(recipeIds);
    return res.json(favourites);
  } catch (error) {
    // if there's an error, log it to the console and return an error status and generic message to the frontend
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something went wrong in get operation." });
  }
});

// create delete endpoint to delete favourites from the database
app.delete("/api/recipe/favourite", async (req, res) => {
  const recipeId = req.body.recipeId;
  try {
    await prismaClient.favouriteRecipes.delete({
      where: {
        recipeId: recipeId,
      },
    });

    return res.status(204).send();
  } catch (error) {
    // if there's an error, log it to the console and return an error status and generic message to the frontend
    console.log(error);
    return res
      .status(500)
      .json({ error: "Something went wrong in delete operation." });
  }
});

// listen on port 3000 and log message to console when server is running
app.listen(3000, () => {
  console.log("Server running on localhost:3000");
});
