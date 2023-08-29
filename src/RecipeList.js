import React from "react";

function RecipeList({ recipes, onDelete }) {
  return (
    <div className="recipe-list">
      <table>
        <thead>
            <th>Name</th>
            <th>Cuisine</th>
            <th>Photo</th>
            <th>Ingredients</th>
            <th>Preparation</th>
            <th>Actions</th>
        </thead>
        <tbody>
          {recipes.map((recipe, index) => (
            <tr key={index}>
              <td>{recipe.name}</td>
              <td>{recipe.cuisine}</td>
              <td><img src={recipe.photo} alt={recipe.name} width="50" height="50" /></td>
              <td className="content_td">{recipe.ingredients}</td>
              <td className="content_td">{recipe.preparation}</td>
              <td>
                <button name="delete" onClick={() => onDelete(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default RecipeList;