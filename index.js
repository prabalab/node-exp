const express = require("express");
const app = express();

// Define a port
const PORT = process.env.PORT || 3000;

// Root route
app.get("/", (req, res) => {
  res.send("Hello, Render! Your Express app is live.");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
