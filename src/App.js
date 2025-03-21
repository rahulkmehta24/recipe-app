import React, { useState } from "react";
import "./App.css";
import RecipeCreate from "./RecipeCreate";
import RecipeList from "./RecipeList";
import RecipeData from "./RecipeData"

function App() {
  const [recipes, setRecipes] = useState(RecipeData);
  
  const addRecipe = (newRecipe) => {
    setRecipes([...recipes, newRecipe]);
  };
  
  const deleteRecipe = (index) => {
    const updatedRecipes = recipes.filter((_, i) => i !== index);
    setRecipes(updatedRecipes);
  };
 
  return (
    <div className="App">
      <header><h1>Food Recipes</h1></header>
      <RecipeList recipes={recipes} onDelete={deleteRecipe} />
      <RecipeCreate onAdd={addRecipe} />
    </div>
  );
}

export default App;
