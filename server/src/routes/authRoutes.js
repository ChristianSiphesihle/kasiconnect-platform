const express = require("express");
const router = express.Router(); //router department in the express application --router contains CRUD methods
const authController = require("../controllers/authController"); //"tells the express application to go to the controller"

router.post("/register", authController.register); //tells the express/server that whenever it sees the request API/AUTH it must provides register reference
module.exports = router;
