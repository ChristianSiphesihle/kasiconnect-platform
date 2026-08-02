const authService = require("../services/authService");

//calls for service
exports.register = async (req, res) => {
  //make register accessable publicly
  try {
    const { fullName, email, passowrd, role } = req.body;
    const user = await authService.registerUser(
      fullName,
      email,
      password,
      role,
    );
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
