'use strict';
// firebase modules
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

// database reference
const ref = admin.database().ref();

// storage modules
const gcs = require('@google-cloud/storage')({keyFilename: 'dokuspace-67e76-firebase-adminsdk-6c17m-d90ed717c0.json'});
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
    thumbPhotoURL: photoURL,
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

exports.updateCourseCreator = functions.database
  .ref('/profiles/{uid}/photoURL')
  .onUpdate(event => {
    const uid = event.params.uid;
    const photoURL = event.data.val();
    console.log('das sind die Creator Infos: ', photoURL);
    console.log('uid: ', uid);

    // IMPORTANT to stop infinite loops
    // if(creator.updated){
    //   return;
    // }
    // creator.updated = true;

    const ref = event.data.adminRef.root.child('/courses');
    ref.once('value').then(function (snap) {
      const values = snap.val();
      console.log('Courses: ', values);

      snap.forEach(function (childSnap) {
        const key = childSnap.key;
        const childData = childSnap.val();
        const creatorUid = childData.creatorUid;
        console.log('creatorUid: ', creatorUid);
        if (uid === creatorUid) {
          console.log('key: ', key);
          console.log(creatorUid, ' matches.');
        }
      });

    });

  });

exports.generateThumbnail = functions.storage.object().onChange(event => {
  // file data
  const object = event.data;
  const filePath = object.name;
  const fileName = filePath.split('/').pop();
  const fileBucket = object.bucket;
  const bucket = gcs.bucket(fileBucket);
  const tempFilePath = `/tmp/${fileName}`;
  const ref = admin.database().ref();
  const file = bucket.file(filePath);
  // this regex matches to the end of a string that contains a slash
  // followed by zero or more or any character that is not a /slash
  const thumbFilePath = filePath.replace(/(\/)?([^\/]*)$/, '$1thumb_$2');

  // data output
  console.log('filePath: ', filePath);

  // IMPORTANT to stop infinite loops
  if (fileName.startsWith('thumb_')) {
    console.log('Already a Thumbnail.');
    return;
  }

  if (!object.contentType.startsWith('image/')) {
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
    return spawn('convert', [tempFilePath, '-thumbnail', '600x600>', tempFilePath]);
  }).then(() => {
    // write image to storage
    console.log('Thumbnail created at', tempFilePath);
    return bucket.upload(tempFilePath, {
      destination: thumbFilePath
    });
  }).then(() => {
    console.log('Database Configuration start.');
    const thumbFile = bucket.file(thumbFilePath);
    const config = {
      action: 'read',
      expires: '01-01-2500' // should expire somewhere far in the future.
    };
    return Promise.all([ // returns an array of promisses
      thumbFile.getSignedUrl(config),
      file.getSignedUrl(config)
    ]);
  }).then(results => {
    console.log('URL reference will be deployed to the database.');
    const thumbResult = results[0];
    const originalResult = results[1];
    const thumbFileUrl = thumbResult[0];
    const fileUrl = originalResult[0];

    // get profileUid and courseId from filePath
    const profileUid = filePath.split('/')[1];
    const courseId = filePath.split('/')[3];

    // get new id
    const key = ref.push({}).key;

    // profile photoURL -> profiles
    if (filePath.includes('profiles/') && filePath.includes('/photo/')) {
      return ref.child(`/profiles/${profileUid}`).update({
          photoId: key,
          photoURL: fileUrl,
          thumbPhotoURL: thumbFileUrl,
          photoName: fileName
        }) &&
        ref.child(`/photos/${profileUid}/${key}`).set({
          photoId: key,
          photoURL: fileUrl,
          thumbPhotoURL: thumbFileUrl,
          photoName: fileName
        });
    }

    // course titleImageUrl -> courses
    if (filePath.includes('profiles/') && filePath.includes('/courses/')) {
      return ref.child(`/courses/${courseId}`).update({
        titleImageId: key,
        titleImageUrl: fileUrl,
        thumbTitleImageUrl: thumbFileUrl,
        titleImageName: fileName
      });
    }

    // if content titleImageUrl -> content ONLY VIDEO
    // return ref.child(`/content/${courseId}/${contentId}`).push({thumbPhotoURL: thumbFileUrl, thumbFileName: fileName});

    // if filePath matches nothing
    return ref.child(`/thumbnails/${profileUid}`).push({
      OriginalFileUrl: fileUrl,
      thumbnailFileUrl: thumbFileUrl,
      fileName: fileName
    });
  });

});
