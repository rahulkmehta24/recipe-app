// import React, { useState } from "react";

// function RecipeCreate({ onAdd }) {
//   const [formData, setFormData] = useState({
//     name: "",
//     cuisine: "",
//     photo: "",
//     ingredients: "",
//     preparation: "",
//   });

//   const handleSubmit = (event) => {
//     event.preventDefault();
//     onAdd({
//       ...formData,
//     });
//     setFormData({
//       name: "",
//       cuisine: "",
//       photo: "",
//       ingredients: "",
//       preparation: "",
//     });
//   };

//   const handleChange = (event) => {
//     const { name, value } = event.target;
//     setFormData({
//       ...formData,
//       [name]: value,
//     });
//   };

//   return (
//     <form name="create" onSubmit={handleSubmit}>
//       <table>
//         <tbody>
//           <tr>
//             <td>
//               <input
//                 type="text"
//                 name="name"
//                 value={formData.name}
//                 onChange={handleChange}
//                 placeholder="Name"
//                 style={{ width: "100%" }}
//               />
//             </td>
//             <td>
//               <input
//                 type="text"
//                 name="cuisine"
//                 value={formData.cuisine}
//                 onChange={handleChange}
//                 placeholder="Cuisine"
//                 style={{ width: "100%" }}
//               />
//             </td>
//             <td>
//               <input
//                 type="text"
//                 name="photo"
//                 value={formData.photo}
//                 onChange={handleChange}
//                 placeholder="URL"
//                 style={{ width: "100%" }}
//               />
//             </td>
//             <td colSpan="3">
//               <textarea
//                 name="ingredients"
//                 value={formData.ingredients}
//                 onChange={handleChange}
//                 placeholder="Ingredients"
//                 style={{ width: "100%" }}
//               ></textarea>
//             </td>
//             <td colSpan="3">
//               <textarea
//                 name="preparation"
//                 value={formData.preparation}
//                 onChange={handleChange}
//                 placeholder="Preparation"
//                 style={{ width: "100%" }}
//               ></textarea>
//             </td>
//             <td>
//               <button type="submit">Create</button>
//             </td>
//           </tr>
//         </tbody>
//       </table>
//     </form>
//   );
// }
// export default RecipeCreate;

import React, { useState, useEffect } from "react";
import axios from "axios";

function RecipeCreate() {
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    photo: null,
    ingredients: "",
    preparation: "",
  });

  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await axios.get("http://localhost:5000/recipes");
      console.log("Fetched Recipes:", response.data);
      
  
      setRecipes(response.data.map((recipe) => ({
        ...recipe,  
        id: recipe.id  
      })));
      console.log("HI",response.data);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
  };

  // ✅ Add Recipe (POST)
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("cuisine", formData.cuisine);
    formDataToSend.append("ingredients", formData.ingredients);
    formDataToSend.append("preparations", formData.preparation);
    if (formData.photo) {
      formDataToSend.append("photo", formData.photo);
    }
  
    try {
      const response = await axios.post("http://localhost:5000/recipes", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
  
      // Ensure the response contains id and add it to the recipe
      setRecipes((prevRecipes) => [...prevRecipes, response.data]); // response.data should include id
      setFormData({ name: "", cuisine: "", photo: null, ingredients: "", preparation: "" });
    } catch (error) {
      console.error("Error adding recipe:", error);
    }
  };

  // ✅ Delete Recipe (DELETE) (FIXED!)
  const handleDelete = async (id) => {
    console.log("Deleting recipe with ID:", id); // Log to check if id is being passed correctly
  
    if (!id) {
      console.error("Invalid recipe ID. Cannot delete.");
      return;
    }
  
    try {
      await axios.delete(`http://localhost:5000/recipes/${id}`);
      console.log(`Recipe with ID ${id} deleted successfully`);
  
      // Update state after deleting
      setRecipes((prevRecipes) => prevRecipes.filter((recipe) => recipe.id !== id));
    } catch (error) {
      console.error("Error deleting recipe:", error);
    }
  };

  return (
    <div>
      <h2>Add Recipe</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="text" name="name" placeholder="Name" required onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
        <input type="text" name="cuisine" placeholder="Cuisine" required onChange={(e) => setFormData({ ...formData, cuisine: e.target.value })} />
        <input type="file" name="photo" accept="image/*" onChange={(e) => setFormData({ ...formData, photo: e.target.files[0] })} />
        <textarea name="ingredients" placeholder="Ingredients" required onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}></textarea>
        <textarea name="preparation" placeholder="Preparation" required onChange={(e) => setFormData({ ...formData, preparation: e.target.value })}></textarea>
        <button type="submit">Create</button>
      </form>

      <h2>Recipes</h2>
      <table border="1">
        <thead>
          <tr>
            <th>Name</th>
            <th>Cuisine</th>
            <th>Photo</th>
            <th>Ingredients</th>
            <th>Preparation</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
  {recipes.map((recipe) => (
    <tr key={recipe.id}>
      <td>{recipe.name}</td>
      <td>{recipe.cuisine}</td>
      <td>
        <img src={`http://localhost:5000${recipe.photo}`} alt={recipe.name} width="100" />
      </td>
      <td>{recipe.ingredients}</td>
      <td>{recipe.preparations}</td>
      <td>
        <button onClick={() => handleDelete(recipe.id)}>Delete</button>
      </td>
    </tr>
  ))}
</tbody>
      </table>
    </div>
  );
}

export default RecipeCreate;


