'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const ref = admin.database().ref();

exports.createProfile = functions.auth.user().onCreate(event => {
  // user data
  const uid = event.data.uid;
  const email = event.data.email;
  const emailVerified = 'false';
  const role = 'Student';
  const photoURL = event.data.photoURL ||
    'https://firebasestorage.googleapis.com/v0/b/dokuspace-67e76.appspot.com/o/cover.png?alt=media&token=4fbdcc40-8b7b-4797-97db-261c4447ac45';

  // reference to database
  const newProfileRef = ref.child(`/profiles/${uid}`);

  // set a new profile to database
  return newProfileRef.set({
    email: email,
    emailVerified: emailVerified,
    photoURL: photoURL,
    role: role
  });
});
