const functions = require("firebase-functions");
const universal = require('./dist/annu-business/server/main');
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.ssrAppFn = functions.runWith({
    // Ensure the function has enough memory and time
    // to process large files
    timeoutSeconds: 300,
    memory: "1GB",
  })
.https
.onRequest(universal.app());
