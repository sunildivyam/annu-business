const functions = require("firebase-functions");
const universal = require('./dist/annu-business/server/main');
const { initializeApp } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
const Storage = require('firebase-admin/storage');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//

exports.ssrAppFn = functions.https.onRequest(universal.app());

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


// Function to get rewrite url of sitemap.xml from store.
exports.getSitemapXmlDownloadUrlFn = functions.https.onRequest(async (req, res) => {
    const storage = Storage.getStorage();
    const bucket = storage.bucket();
    const file = bucket.file('sitemap.xml');

    const downloadUrl = await file.getSignedUrl({ action: 'read', expires: '2024-12-12' });

    res.status(200).send({ url: downloadUrl });
});
