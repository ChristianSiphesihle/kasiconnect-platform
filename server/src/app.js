const express = require("express"); //load the express library from node-modules
const app = express(); // create the Express application(server)
app.use(express.json()); //JSON parsing (convert json to something firestor would understand)

//testing the endpoint
app.get("/", (req, res) => {
  res.send("Welcome to KasiConnect API");
});

module.exports = app;
