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

exports.getBusinessById = async (req, res) => {
  try {
    const business = await businessService.getBusinessById(req.params.id);
    res.status(200).json({ business });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.updateBusiness = async (req, res) => {
  try {
    const business = await businessService.updateBusiness(
      req.params.id,
      req.body,
      req.user.uid,
    );
    res.status(200).json({
      message: "Business updated successfully",
      business,
    });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.deleteBusiness = async (req, res) => {
  try {
    await businessService.deleteBusiness(req.params.id, req.user.uid);
    res.status(200).json({ message: "Business deleted successfully" });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};

exports.getMyBusinesses = async (req, res) => {
  try {
    const businesses = await businessService.getMyBusinesses(req.user.uid);
    res.status(200).json({ businesses });
  } catch (error) {
    res.status(error.statusCode || 500).json({ message: error.message });
  }
};
