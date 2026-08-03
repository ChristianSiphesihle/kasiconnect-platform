const express = require("express"); //load the express library from node-modules
const { db } = require("./config/firebase");
const app = express(); // create the Express application(server)
app.use(express.json()); //JSON parsing (convert json to something firestor would understand)
app.use((req, res, next) => {
  console.log("Incoming:", req.method, req.url);
  next();
});

const authRoutes = require("./routes/authRoutes");

app.use("/api/auth", authRoutes);
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
    res.status(500).send("Database Connection failed");
  }
});

module.exports = app;
