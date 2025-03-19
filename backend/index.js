// require("dotenv").config();
// const express = require("express");
// const mysql = require("mysql2");
// const bodyParser = require("body-parser");
// const cors = require("cors");
// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const app = express();
// const PORT = process.env.PORT || 5000;

// // Middleware
// app.use(cors());
// app.use(bodyParser.json());
// app.use(express.static("uploads")); // Serve static files from uploads folder

// // MySQL Connection
// const db = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "Rahul@2001", // Replace with your MySQL password
//   database: "RECIPES",
// });

// db.connect((err) => {
//   if (err) {
//     console.error("Database connection failed:", err);
//   } else {
//     console.log("Connected to MySQL Database");
//   }
// });

// // Ensure 'uploads' folder exists
// const uploadDir = path.join(__dirname, "uploads");
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// // Multer Storage Configuration
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads/"); // Save images in 'uploads' folder
//   },
//   filename: (req, file, cb) => {
//     cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
//   },
// });

// // File Filter (Only Allow Images)
// const fileFilter = (req, file, cb) => {
//   const allowedTypes = /jpeg|jpg|png/;
//   const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedTypes.test(file.mimetype);
//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb(new Error("Only images (JPEG, PNG) are allowed!"), false);
//   }
// };

// const upload = multer({ storage, fileFilter });

// // Create a Recipe (With Image Upload)
// app.post("/RECIPES", upload.single("photo"), (req, res) => {
//     const { name, cuisine, ingredients, preparations } = req.body;
//     const photo = req.file ? `/uploads/${req.file.filename}` : null;
  
//     if (!name || !cuisine || !ingredients || !preparations) {
//       return res.status(400).json({ error: "All fields are required!" });
//     }
  
//     const sql = `INSERT INTO RECIPES (name, cuisine, photo, ingredients, preparations) VALUES (?, ?, ?, ?, ?)`;
//     db.query(sql, [name, cuisine, photo, ingredients, preparations], (err, result) => {
//       if (err) {
//         return res.status(500).json({ error: err.message });
//       }
//       res.status(201).json({ message: "Recipe added successfully", id: result.insertId, photo });
//     });
//   });  

// // Get All RECIPES
// app.get("/RECIPES", (req, res) => {
//   db.query("SELECT * FROM RECIPES", (err, results) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.json(results);
//   });
// });

// // Get Recipe by ID
// app.get("/RECIPES/:id", (req, res) => {
//   const sql = "SELECT * FROM RECIPES WHERE id = ?";
//   db.query(sql, [req.params.id], (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     if (result.length === 0) {
//       return res.status(404).json({ message: "Recipe not found" });
//     }
//     res.json(result[0]);
//   });
// });

// // Update a Recipe (With Image Upload)
// app.put("/RECIPES/:id", upload.single("photo"), (req, res) => {
//   const { name, cuisine, ingredients, preparations } = req.body;
//   let sql = `UPDATE RECIPES SET name=?, cuisine=?, ingredients=?, preparations=? WHERE id=?`;
//   let params = [name, cuisine, ingredients, preparations, req.params.id];

//   if (req.file) {
//     const photo = `/uploads/${req.file.filename}`;
//     sql = `UPDATE RECIPES SET name=?, cuisine=?, photo=?, ingredients=?, preparations=? WHERE id=?`;
//     params = [name, cuisine, photo, ingredients, preparations, req.params.id];
//   }

//   db.query(sql, params, (err, result) => {
//     if (err) {
//       return res.status(500).json({ error: err.message });
//     }
//     res.json({ message: "Recipe updated successfully" });
//   });
// });

// // Delete a Recipe
// app.delete("/recipes/:id", (req, res) => {
//     const recipeId = req.params.id;
  
//     // Get the photo path before deleting the record
//     const getPhotoSQL = "SELECT photo FROM recipes WHERE id = ?";
//     db.query(getPhotoSQL, [recipeId], (err, result) => {
//       if (err) {
//         console.error("Error fetching photo:", err);
//         return res.status(500).json({ error: "Database error" });
//       }
  
//       if (result.length === 0) {
//         return res.status(404).json({ error: "Recipe not found" });
//       }
  
//       const photoPath = result[0].photo ? path.join(__dirname, result[0].photo) : null;
  
//       // Delete the record from database
//       const deleteSQL = "DELETE FROM recipes WHERE id = ?";
//       db.query(deleteSQL, [recipeId], (err, deleteResult) => {
//         if (err) {
//           console.error("Error deleting recipe:", err);
//           return res.status(500).json({ error: "Database error" });
//         }
  
//         // If the record was deleted, delete the associated image
//         if (photoPath && fs.existsSync(photoPath)) {
//           fs.unlink(photoPath, (unlinkErr) => {
//             if (unlinkErr) console.error("Error deleting file:", unlinkErr);
//           });
//         }
  
//         res.json({ message: "Recipe deleted successfully" });
//       });
//     });
//   });

// // Start Server
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

const express = require("express");
const mysql = require("mysql2");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("uploads")); // Serve images

// ✅ Database Connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Rahul@2001",
  database: "RECIPES",
});

db.connect((err) => {
  if (err) console.error("Database connection failed:", err);
  else console.log("Connected to MySQL Database");
});

// ✅ Multer for Image Upload
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ✅ Get All Recipes
app.get("/recipes", (req, res) => {
  db.query("SELECT * FROM recipes", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// ✅ Add Recipe (POST)
app.post("/recipes", upload.single("photo"), (req, res) => {
    const { name, cuisine, ingredients, preparations } = req.body;
    const photo = req.file ? `/uploads/${req.file.filename}` : null;
  
    db.query(
      "INSERT INTO recipes (name, cuisine, photo, ingredients, preparations) VALUES (?, ?, ?, ?, ?)",
      [name, cuisine, photo, ingredients, preparations],
      (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ 
          message: "Recipe added successfully", 
          id: result.insertId,  // This ensures the id is sent back in the response
          photo 
        });
      }
    );
  });

// ✅ Delete Recipe (DELETE) (FIXED!)
app.delete("/recipes/:id", (req, res) => {
    const recipeId = req.params.id;
  
    // Step 1: Get the photo path
    db.query("SELECT photo FROM recipes WHERE id = ?", [recipeId], (err, result) => {
      if (err) {
        console.error("Error fetching photo:", err);
        return res.status(500).json({ error: "Database error" });
      }
  
      if (result.length === 0) {
        return res.status(404).json({ error: "Recipe not found" });
      }
  
      const photoPath = result[0].photo ? path.join(__dirname, result[0].photo) : null;
  
      // Step 2: Delete the recipe from DB
      db.query("DELETE FROM recipes WHERE id = ?", [recipeId], (err, deleteResult) => {
        if (err) {
          console.error("Error deleting recipe:", err);
          return res.status(500).json({ error: "Database error" });
        }
  
        // Step 3: Delete the image file (if exists)
        if (photoPath && fs.existsSync(photoPath)) {
          fs.unlink(photoPath, (unlinkErr) => {
            if (unlinkErr) console.error("Error deleting file:", unlinkErr);
          });
        }
  
        res.json({ message: "Recipe deleted successfully" });
      });
    });
  });

app.listen(5000, () => console.log("🔥 Server running on port 5000"));
