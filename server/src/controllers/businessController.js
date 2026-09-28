const businessService = require("../services/businessService");

exports.createBusiness = async (req, res) => {
  try {
    const business = await businessService.createBusiness(
      req.body,
      req.user.uid,
    );

    res.status(201).json({
      message: "Business Profile Created Successfully",
      business,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

exports.getBusinesses = async (req, res) => {
  try {
    const businesses = await businessService.getBusinesses();

    res.status(200).json({
      businesses,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
