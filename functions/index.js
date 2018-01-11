'use strict';
// firebase modules
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// database reference
const ref = admin.database().ref();

// storage modules
const gcs = require('@google-cloud/storage')({keyFileName: 'dokuspace-67e76-firebase-adminsdk-6c17m-d90ed717c0.json'});
// provides methods to execute external programms
const spawn = require('child-process-promise').spawn;

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

  // removes the specified profile from database
  return profileRef.remove();
});

exports.generateThumbnail = functions.storage.object().onChange(event => {
  // file data
  const object = event.data;
  const filePath = object.name;
  const fileName = filePath.split('/').pop();
  const fileBucket = object.bucket;
  const bucket = gcs.bucket(fileBucket);
  const tempFilePath = `/tmp/${fileName}`;

  // IMPORTANT to stop infinite loops
  if(fileName.startsWith('thumb_')) {
    console.log('Already a Thumbnail.');
    return;
  }

  if(!object.contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return;
  }

  if (object.resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return;
  }

  // download the image
  return bucket.file(filePath).download({
    destination: tempFilePath
  }).then(() => {
    // resize the image
    console.log('Image downloaded locally to', tempFilePath);
    // executes the imagemagick convert cli
    return spawn('convert', [tempFilePath, '-thumbnail', '200x200>', tempFilePath]);
  }).then(() => {
    // write image to storage
    console.log('Thumbnail created at', tempFilePath);
    // this regex matches to the end of a string that contains a slash
    // followed by zero or more or any character that is not a /slash
    const thumbFilePath = filePath.replace(/(\/)?([^\/]*)$/,
      '$1thumb_$2');

    return bucket.upload(tempFilePath, {
      destination: thumbFilePath
    });
  });


});
