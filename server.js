const express = require("express");
const app = express();
require("dotenv").config();

const usersRoute = require("./routes/users");
app.use("/users", usersRoute);

app.get("/", (req, res) => {
  res.send("<h1>Hello, Express.js Server!</h1>");
});

const port = process.env.PORT || 6090; // You can use environment variables for port configuration
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
