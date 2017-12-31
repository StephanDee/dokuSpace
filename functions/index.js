'use strict';
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const ref = admin.database().ref();

exports.createProfile = functions.auth.user().onCreate(event => {
  // user data
  const uid = event.data.uid;
  const email = event.data.email;
  const emailVerified = false;
  const superAdmin = false;
  const role = 'Student';
  const photoURL = event.data.photoURL ||
    'https://firebasestorage.googleapis.com/v0/b/dokuspace-67e76.appspot.com/o/defaultprofile_430x300.jpg?alt=media&token=a06a7924-cca4-4995-bee5-c8be08aa3815';

  // reference to database
  const newProfileRef = ref.child(`/profiles/${uid}`);

  // set a new profile to database
  return newProfileRef.set({
    email: email,
    emailVerified: emailVerified,
    photoURL: photoURL,
    superAdmin: superAdmin,
    role: role
  });
});

exports.deleteProfile = functions.auth.user().onDelete(event => {
  // user data
  const uid = event.data.uid;
  // reference to database
  const profileRef = ref.child(`/profiles/${uid}`);

  // set a new profile to database
  return profileRef.remove();
});
