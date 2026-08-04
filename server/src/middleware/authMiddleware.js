const { auth } = require("../config/firebase");

exports.verifyToken = async (req, res, next) => {
  console.log("verifyToken middleware reached");

  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Unauthorized : No Token provided",
      });
    }
    const token = authHeader.split(" ")[1];
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Unauthorized: Invalid or expired token.",
    });
  }
};
