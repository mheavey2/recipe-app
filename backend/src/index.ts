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

// create post endpoint using PrismaClient to handle posting operations on the favoutrite recipes database
app.post("api/recipe/favourite", async (req, res) => {
  const { recipeId } = req.body;
  try {
    const favouriteRecipe = await prismaClient.favouriteRecipes.create({
      data: { recipeId },
    });
    res.status(201).json(favouriteRecipe);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "favourite recipe post error. Something went wrong." });
  }
});

// listen on port 3000 and log message to console when server is running
app.listen(3000, () => {
  console.log("Server running on localhost:3000");
});
