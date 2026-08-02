const express = require("express"); //load the express library from node-modules
const db = require("./config/firebase");
const app = express(); // create the Express application(server)
app.use(express.json()); //JSON parsing (convert json to something firestor would understand)

//testing the endpoint
app.get("/test-db", async (req, res) => {
  try {
    await db.collection("test").add({
      message: "Firestore connection successful ",
      timestamp: new Date(),
    });
    res.status(200).send("Firestore connection successful");
  } catch (error) {
    console.error(error);
    res.status(500).send.apply("Database Connection failed");
  }
});

module.exports = app;
