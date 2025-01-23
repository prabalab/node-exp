const express = require("express");
const bodyParser = require("body-parser");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the form
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/form.html");
});

// Connect to the PostgreSQL database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // Render will inject this
  ssl: {
    rejectUnauthorized: false, // Necessary for secure connection
  },
});

// Create a table if it doesn't exist
pool.query(
  `CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
  )`,
  (err) => {
    if (err) console.error("Error creating table:", err.message);
  }
);

// Handle form submissions
app.post("/add_user", async (req, res) => {
  const { name, email } = req.body;

  try {
    await pool.query("INSERT INTO users (name, email) VALUES ($1, $2)", [name, email]);
    res.send(`<p>User ${name} added successfully! <a href="/">Go back</a></p>`);
  } catch (err) {
    console.error("Error inserting user:", err.message);
    res.status(500).send("Error adding user.");
  }
});


// Fetch and display all users
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users");

    // Generate an HTML table to display users
    let usersHtml = `
      <h1>All Users</h1>
      <table border="1">
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
        </tr>`;
    result.rows.forEach((user) => {
      usersHtml += `
        <tr>
          <td>${user.id}</td>
          <td>${user.name}</td>
          <td>${user.email}</td>
        </tr>`;
    });
    usersHtml += `
      </table>
      <br>
      <button onclick="window.location.href='/'">Back to Form</button>`;

    res.send(usersHtml);
  } catch (err) {
    console.error("Error fetching users:", err.message);
    res.status(500).send("Error fetching users.");
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
