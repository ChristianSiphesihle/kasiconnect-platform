const { auth, db } = require("../config/firebase");

exports.registerUser = async (fullName, email, password, role) => {
  //create the user auth
  try {
    const userRecord = await auth.createUser({
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
