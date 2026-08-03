const authService = require("../services/authService");

//calls for service
exports.register = async (req, res) => {
  //make register accessable publicly
  try {
    const { fullName, email, password, role } = req.body;
    const user = await authService.registerUser(
      fullName,
      email,
      password,
      role,
    );
    res.status(201).json({
      //201 creation code
      message: "User registered successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

//for now !!
exports.getCurrentUser = async (req, res) => {
  res.status(200).json({
    message: "Current user endpoint works!",
    user: req.user,
  });
};
