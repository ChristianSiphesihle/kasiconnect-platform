//contians application configuration

const admin = require("firebase-admin"); //provides unlimited permission to the firebase(fire store)

const serviceAccount = require("./kasiconnect-18564-firebase-adminsdk-fbsvc-d7420c686c.json"); //server's passport
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount), // initialize firebase
});

const db = admin.firestore(); //creates database, makes Express connect to firestore
const auth = admin.auth();
module.exports = {
  db,
  auth,
};
