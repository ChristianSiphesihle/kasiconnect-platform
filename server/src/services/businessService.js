const { db } = require("../config/firebase");

exports.createBusiness = async (businessData, ownerId) => {
  const {
    businessName,
    description,
    category,
    phone,
    email,
    address,
    municipality,
    ward,
    operatingHours,
    profileImage,
  } = businessData;

  validateBusinessData(businessData);
  //protects the server nerver trust frontend fully  SERVER VALIDATION
  if (
    !businessName ||
    !description ||
    !category ||
    !phone ||
    !email ||
    !address ||
    !municipality ||
    !operatingHours
  ) {
    throw new Error("Please provide all required business information.");
  }

  const businessReference = db.collection("businesses").doc();

  // creating the business object. -OOD which we will be able to use in the future
  const business = {
    businessId: businessReference.id,
    ownerId,
    businessName,
    description,
    category,
    phone,
    email,
    address,
    municipality,
    ward: "",
    operatingHours,
    profileImage: "",

    status: "Pending",
    createdAt: new Date(),
  };
  await businessReference.set(business);

  return business;
};

exports.getBusinesses = async () => {
  const snapshot = await db.collection("businesses").get();

  const businesses = snapshot.docs.map((doc) => doc.data());

  return businesses;
};

// Small helper: creates an error that carries an HTTP status code
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

exports.getBusinessById = async (businessId) => {
  const doc = await db.collection("businesses").doc(businessId).get();

  if (!doc.exists) {
    throw createError("Business not found", 404);
  }

  return doc.data();
};

exports.updateBusiness = async (businessId, updates, userId) => {
  const businessReference = db.collection("businesses").doc(businessId);
  const doc = await businessReference.get();

  if (!doc.exists) {
    throw createError("Business not found", 404);
  }

  // Ownership check: only the creator may edit
  if (doc.data().ownerId !== userId) {
    throw createError("You are not allowed to edit this business", 403);
  }

  // Whitelist: only these fields can be changed
  const allowedFields = [
    "businessName",
    "description",
    "category",
    "phone",
    "email",
    "address",
    "municipality",
    "ward",
    "operatingHours",
    "profileImage",
  ];
  validateBusinessData(updateData);
  const updateData = {};
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      updateData[field] = updates[field];
    }
  });

  if (Object.keys(updateData).length === 0) {
    throw createError("No valid fields provided to update", 400);
  }

  updateData.updatedAt = new Date();

  await businessReference.update(updateData);

  return { ...doc.data(), ...updateData };
};

exports.deleteBusiness = async (businessId, userId) => {
  const businessReference = db.collection("businesses").doc(businessId);
  const doc = await businessReference.get();

  if (!doc.exists) {
    throw createError("Business not found", 404);
  }

  if (doc.data().ownerId !== userId) {
    throw createError("You are not allowed to delete this business", 403);
  }

  await businessReference.delete();
};

const validateBusinessData = (data) => {
  const { email, phone } = data;

  if (email !== undefined && !/^\S+@\S+\.\S+$/.test(email)) {
    throw createError("Invalid email format", 400);
  }

  // Accepts 0821234567 or +27821234567 (spaces are ignored)
  if (
    phone !== undefined &&
    !/^(\+27|0)\d{9}$/.test(String(phone).replace(/\s/g, ""))
  ) {
    throw createError("Invalid South African phone number", 400);
  }
};
