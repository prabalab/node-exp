const express = require("express");
const path = require("path");

const app = express();

// Serve the HTML form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "form.html"));
});

// Handle the GET request
app.get("/process_get", (req, res) => {
  const firstName = req.query.first_name;
  const lastName = req.query.last_name;

  // Respond with the received data
  res.send(`Hello, ${firstName} ${lastName}! Your form was submitted successfully.`);
});

// Set the port (Render uses environment variable PORT)
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
