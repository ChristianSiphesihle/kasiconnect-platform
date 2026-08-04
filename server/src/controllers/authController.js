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
  res.status(200).json({
    message: "Current user retrieved successfully",
    user: req.user,
  });
};
