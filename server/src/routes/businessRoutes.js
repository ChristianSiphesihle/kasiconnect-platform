const express = require("express");
const router = express.Router();

const businessController = require("../controllers/businessController");
const { verifyToken } = require("../middleware/authMiddleware");

router.post("/", verifyToken, businessController.createBusiness);
router.get("/", businessController.getBusinesses);
router.get("/mine", verifyToken, businessController.getMyBusinesses); // must come BEFORE /:id
router.get("/:id", businessController.getBusinessById);
router.put("/:id", verifyToken, businessController.updateBusiness);
router.delete("/:id", verifyToken, businessController.deleteBusiness);

module.exports = router;
