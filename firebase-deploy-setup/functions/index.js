const functions = require("firebase-functions");
const universal = require('./dist/annu-business/server/main');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.ssrAppFn = functions.https.onRequest(universal.app());


const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

initializeApp();

// On sign up.
exports.processSignUp = functions.auth.user().onCreate(async (user) => {
    // Check if user meets role criteria.
    if ((user.email && user.emailVerified) || user.phoneNumber) {
        const customClaims = {
            admin: user.email === 'sunil.divyam@gmail.com' ? true : false,
            author: true
        };

        try {
            // Set custom user claims on this newly created user.
            await getAuth().setCustomUserClaims(user.uid, customClaims);
        } catch (error) {
            console.log(error);
        }
    }
});
