import React, { useState, useEffect } from "react";
import { RecipeSummary } from "../types";

interface Props {
  recipeId: string;
  onClose: () => void;
}

const RecipeModal = () => {
  const [recipeSummary, setRecipeSummary] = useState<RecipeSummary>();
  // if recipeSummary is undefined return empty jsx. need this or there'll be errors with the recipe summary paragraph
  if (!recipeSummary) {
    return <></>;
  }

  useEffect(() => {
    const fetchRecipeSummary = async () => {
      try {
        const summary = await getRecipeSummary(recipeId);
        setRecipeSummary(summaryRecipe);
      } catch (error) {
        console.log(error);
      }
    };
    fetchRecipeSummary();
  }, recipeId);

  return (
    <>
      <div className="overlay"></div>
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{recipeSummary?.title}</h2>
            <span className="close-btn">&times;</span>
          </div>
          {/* need to use dangerouslySetInnerHTML because the summary contains html tags within the text string */}
          <p dangerouslySetInnerHTML={{ __html: recipeSummary.summary }}></p>
        </div>
      </div>
    </>
  );
};

export default RecipeModal;
