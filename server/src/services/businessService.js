const { db } = require("../config/firebase");

// Helper: creates an error that carries an HTTP status code
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

// Checks email and phone, but only for fields that were actually sent
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

exports.createBusiness = async (businessData, ownerId) => {
  const {
    businessName,
    description,
    category,
    phone,
    email,
    address,
    municipality,
    ward = "", // default, so Firestore never receives undefined
    operatingHours,
    profileImage = "", // default, so Firestore never receives undefined
  } = businessData;

  // server validation: never trust the frontend fully
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
    throw createError("Please provide all required business information.", 400);
  }

  validateBusinessData(businessData);

  const businessReference = db.collection("businesses").doc();

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
    ward, // the value from the form
    operatingHours,
    profileImage, // the uploaded photo URL
    status: "Pending",
    createdAt: new Date(),
  };

  await businessReference.set(business);

  return business;
};

// Public list: customers only see Approved businesses
exports.getBusinesses = async () => {
  const snapshot = await db
    .collection("businesses")
    .where("status", "==", "Approved")
    .get();

  return snapshot.docs.map((doc) => doc.data());
};

// A seller's own businesses, including Pending ones
exports.getMyBusinesses = async (ownerId) => {
  const snapshot = await db
    .collection("businesses")
    .where("ownerId", "==", ownerId)
    .get();

  return snapshot.docs.map((doc) => doc.data());
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

  if (doc.data().ownerId !== userId) {
    throw createError("You are not allowed to edit this business", 403);
  }

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

  // 1. create the object FIRST
  const updateData = {};

  // 2. fill it from the whitelist
  allowedFields.forEach((field) => {
    if (updates[field] !== undefined) {
      updateData[field] = updates[field];
    }
  });

  // 3. only now can we validate it
  validateBusinessData(updateData);

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

  // delete the business's products together with the business
  const productsSnapshot = await db
    .collection("products")
    .where("businessId", "==", businessId)
    .get();

  const batch = db.batch();
  productsSnapshot.forEach((productDoc) => batch.delete(productDoc.ref));
  batch.delete(businessReference);
  await batch.commit();
};
