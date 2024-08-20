const express = require("express");
const cors = require("cors");

const app = express();

// Enable CORS
app.use(cors());

// Use .env file
require("dotenv").config();

// Register routes
const usersRoute = require("./routes/users");
app.use("/users", usersRoute);

// Not sure whether to have nothing for this
app.get("/", (req, res) => {
  res.send("<h1>Hello, Express.js Server!</h1>");
});

const port = process.env.PORT || 6090; // You can use environment variables for port configuration
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
