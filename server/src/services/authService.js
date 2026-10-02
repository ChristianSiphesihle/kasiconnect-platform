const { auth, db } = require("../config/firebase");

exports.registerUser = async (userData) => {
  const { fullName, email, password, role } = userData;
  //create the user auth
  try {
    const userRecord = await auth.createUser({
      fullName,
      email,
      password,
      displayName: fullName,
    });
    await db.collection("users").doc(userRecord.uid).set({
      // store the user profile in firestore
      fullName,
      email,
      role,
      createdAt: new Date(),
    });

    return {
      uid: userRecord.uid,
      fullName,
      email,
      role,
    };
  } catch (error) {
    throw error;
  }
};

exports.getUserProfile = async (uid) => {
  const doc = await db.collection("users").doc(uid).get();
  if (!doc.exists) return null;
  return { uid, ...doc.data() };
};