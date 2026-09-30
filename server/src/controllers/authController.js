const authService = require("../services/authService");

//calls for service
exports.register = async (req, res) => {
  //make register accessable publicly
  try {
    const { fullName, email, password, role } = req.body; //possible remove...
    const user = await authService.registerUser(req.body);
    res.status(201).json({
      //201 creation code
      message: "User registerd successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

exports.getCurrentUser = async (req, res) => {
  try {
    const user = await authService.getUserProfile(req.user.uid);
    if (!user) {
      return res.status(404).json({ message: "User profile not found" });
    }
    res
      .status(200)
      .json({ message: "Current user retrieved successfully", user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
