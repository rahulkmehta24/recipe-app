import React, { useState } from "react";

function RecipeCreate({ onAdd }) {
  const [formData, setFormData] = useState({
    name: "",
    cuisine: "",
    photo: "",
    ingredients: "",
    preparation: "",
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    onAdd({
      ...formData,
    });
    setFormData({
      name: "",
      cuisine: "",
      photo: "",
      ingredients: "",
      preparation: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  return (
    <form name="create" onSubmit={handleSubmit}>
      <table>
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
                style={{ width: "100%" }}
              />
            </td>
            <td>
              <input
                type="text"
                name="cuisine"
                value={formData.cuisine}
                onChange={handleChange}
                placeholder="Cuisine"
                style={{ width: "100%" }}
              />
            </td>
            <td>
              <input
                type="text"
                name="photo"
                value={formData.photo}
                onChange={handleChange}
                placeholder="URL"
                style={{ width: "100%" }}
              />
            </td>
            <td colSpan="3">
              <textarea
                name="ingredients"
                value={formData.ingredients}
                onChange={handleChange}
                placeholder="Ingredients"
                style={{ width: "100%" }}
              ></textarea>
            </td>
            <td colSpan="3">
              <textarea
                name="preparation"
                value={formData.preparation}
                onChange={handleChange}
                placeholder="Preparation"
                style={{ width: "100%" }}
              ></textarea>
            </td>
            <td>
              <button type="submit">Create</button>
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  );
}
export default RecipeCreate;