const admin = require('firebase-admin');
const serviceAccount = require('../serviceAccountKey.json'); // Assurez-vous que ce chemin est correct

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  // databaseURL: "https://YOUR_DATABASE_NAME.firebaseio.com" // Optionnel si vous n'utilisez pas Realtime Database
});

const db = admin.firestore();

const usersData = {
  "users": [
    {
      "username": "admin",
      "password": "cGFzc3dvcmQ=",
      "subscription": [
        {
          "game": "cr",
          "type": "3"
        },
        {
          "game": "warzone",
          "type": "2"
        },        
        {
          "game": "overwatch",
          "type": "2"
        },
        {
          "game": "valorant",
          "type": "3"
        }
      ]
    },
    {
      "username": "user",
      "password": "cGFzc3dvcmQ=",
      "subscription": [
        {
          "game": "cr",
          "type": "3"
        },
        {
          "game": "valorant",
          "type": "1"
        }
      ]
    }
  ]
};

async function importUsers() {
  console.log("Starting user import to Firebase Auth and Firestore...");
  for (const userData of usersData.users) {
    try {
      const password = Buffer.from(userData.password, 'base64').toString('utf8');
      const email = `${userData.username}@example.com`; // Firebase Auth requires an email

      // Create user in Firebase Authentication
      let userRecord;
      try {
        userRecord = await admin.auth().getUserByEmail(email);
        console.log(`User ${userData.username} already exists in Firebase Auth. Skipping creation.`);
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          userRecord = await admin.auth().createUser({
            email: email,
            password: password,
            displayName: userData.username,
          });
          console.log(`User ${userData.username} created in Firebase Auth with UID: ${userRecord.uid}`);
        } else {
          throw error;
        }
      }

      // Store user data in Firestore
      const docRef = db.collection('users').doc(userRecord.uid); 
      await docRef.set({
        username: userData.username,
        subscription: userData.subscription
      });
      console.log(`User ${userData.username} data imported to Firestore.`);
    } catch (error) {
      console.error(`Error importing user ${userData.username}:`, error);
    }
  }
  console.log("User import finished.");
}

importUsers();
