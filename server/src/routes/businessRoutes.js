const express = require("express");
const router = express.Router();

const businessController = require("../controllers/businessController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, businessController.createBusiness);

module.exports = router;
