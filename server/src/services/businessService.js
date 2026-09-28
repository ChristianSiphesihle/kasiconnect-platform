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
    ward,
    operatingHours,
    profileImage,

    status: "Pending",
    createdAt: new Date(),
  };
  await businessReference.set(business);

  return business;
};

exports.getBusinesses = async () => {
  console.log("→ starting Firestore query");
  const snapshot = await db.collection("businessses").get();
  console.log("→ Firestore query finished, doc count:", snapshot.size);

  const businesses = [];

  snapshot.forEach((businessDoc) => {
    businesses.push(businessDoc.data()); //collectets the busineses as objectes , store them in an array
  });

  return businesses;
};
