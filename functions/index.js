const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello from Firebase!");
});

exports.sendMessage = functions.firestore
    .document('MESSAGES2SEND/{messageId}')
    .onCreate(docSnap => {

        const messageData = docSnap.data();
        const token = messageData.token;
        const message = messageData.msg;

        // Message details for end user
        const payload = {
            notification: {
                title: 'New message!',
                body: message,
                icon: 'https://chanel-vn.firebaseapp.com/assets/imgs/logo_chanel.png'
            }
        }

        return admin.messaging().sendToDevice(token, payload)
        
    });
