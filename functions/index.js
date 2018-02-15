/**
 * Cloud Functions. In here all Cloud Functions are deployed.
 * The Code of the Cloud Functions will not be used on the Client-Side.
 * It'll be deployed to the dokuSpace Firebase Cloud and triggers events from there.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
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
const spawn = require('child-process-promise').spawn; // Pass an additional capture option to buffer the result

/**
 * Triggers onCreate Authentication events.
 * After Registration a new Profile Reference in the Database
 * will be deployed for the authenticated User.
 *
 * @type {CloudFunction<UserRecord>}
 */
exports.createProfile = functions.auth.user().onCreate(event => {
  // user data
  const uid = event.data.uid;
  const email = event.data.email;
  const emailVerified = false; // only Event Parameters are returned, the rest is hardcoded.
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

/**
 * Triggers onDelete Authentication events.
 * After a Deletion of a User The Profile Reference
 * in the Database will be deleted.
 *
 * @type {CloudFunction<UserRecord>}
 */
exports.deleteProfile = functions.auth.user().onDelete(event => {
  // user data
  const uid = event.data.uid;
  // reference to database
  const profileRef = ref.child(`/profiles/${uid}`);

  // removes the specified profile from database
  return profileRef.remove();
});

/**
 * Triggers onUpdate Database events.
 * After the photoURL of a Profile is changed,
 * this method checks all courses for the same
 * creatorUid and updates the creatorPhotoURL.
 * Otherwise it'll change nothing.
 *
 * @type {CloudFunction<DeltaSnapshot>}
 */
exports.updateCourseCreatorPhotoURL = functions.database
  .ref('/profiles/{uid}/photoURL')
  .onUpdate(event => {
    const uid = event.params.uid;
    const photoURL = event.data.val();

    const ref = event.data.adminRef.root.child('/courses');
    ref.once('value').then(function (snap) {
      // const values = snap.val();
      // console.log('Courses: ', values);

      return snap.forEach(function (childSnap) {
        const courseId = childSnap.key;
        const childData = childSnap.val();
        const creatorUid = childData.creatorUid;
        if (uid === creatorUid) {
          console.log('The creatorUid: ', creatorUid, ' matches.');
          console.log('The Creator Photo of the courseId: ', courseId, ' will be updated.');

          ref.child(`/${courseId}`).update({
            creatorPhotoURL: photoURL
          });
        }
      });
    });
  });

/**
 * Triggers onUpdate Database events.
 * After the ThumbPhotoURL of a Profile is changed,
 * this method checks all courses for the same
 * creatorUid and updates the thumbCreatorPhotoURL.
 * Otherwise it'll change nothing.
 *
 * @type {CloudFunction<DeltaSnapshot>}
 */
exports.updateCourseCreatorThumbPhotoURL = functions.database
  .ref('/profiles/{uid}/thumbPhotoURL')
  .onUpdate(event => {
    const uid = event.params.uid;
    const thumbPhotoURL = event.data.val();

    const ref = event.data.adminRef.root.child('/courses');
    ref.once('value').then(function (snap) {
      // const values = snap.val();
      // console.log('Courses: ', values);

      return snap.forEach(function (childSnap) {
        const courseId = childSnap.key;
        const childData = childSnap.val();
        const creatorUid = childData.creatorUid;

        if (uid === creatorUid) {
          console.log('The creatorUid: ', creatorUid, ' matches.');
          console.log('The Creator Thumbnail of the courseId: ', courseId, ' will be updated.');

          ref.child(`/${courseId}`).update({
            thumbCreatorPhotoURL: thumbPhotoURL
          });
        }
      });
    });
  });

/**
 * Triggers onChange Storage events.
 * After a File is putted into the Storage,
 * it'll check if it was a Deletion,
 * not an Image and if it is a thumbnail File.
 * If so, it'll return nothing.
 * Otherwise this method will return a converted Version of the File,
 * and puts a Database Reference.
 *
 * @type {CloudFunction<ObjectMetadata>}
 */
exports.generateThumbnail = functions.storage.object().onChange(event => {
  // file data
  const object = event.data; // The Storage object.
  const filePath = object.name; // File Path in the bucket.
  const fileName = filePath.split('/').pop();
  const fileBucket = object.bucket; // The Storage Bucket that contains the File.
  const bucket = gcs.bucket(fileBucket);
  const tempFilePath = `/tmp/${fileName}`;
  const ref = admin.database().ref(); // not needed
  const file = bucket.file(filePath);

  // The REGEX matches to the last string that contains a /slash
  // followed by any character or number that is not a /slash
  const thumbFilePath = filePath.replace(/(\/)?([^\/]*)$/, '$1thumb_$2');
  // console.log('$1: ', RegExp.$1); // Path
  // console.log('$2: ', RegExp.$2); // Filename

  // Data Output
  console.log('filePath: ', filePath);

  // IMPORTANT: check that thumbnails exist, to stop infinite loops
  if (fileName.startsWith('thumb_')) {
    console.log('Already a Thumbnail.');
    return;
  }

  // only Images will be converted
  if (!object.contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return;
  }

  // Deletion Events should be ignored
  if (object.resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return;
  }

  // download the Image
  return bucket.file(filePath).download({
    destination: tempFilePath
  }).then(() => {
    // resize the Image
    console.log('Image downloaded locally to', tempFilePath);
    // executes the imagemagick convert cli
    return spawn('convert', [tempFilePath, '-thumbnail', '600x340>', tempFilePath]);
  }).then(() => {
    // write Converted Image to Storage
    console.log('Thumbnail created at', tempFilePath);
    return bucket.upload(tempFilePath, {
      destination: thumbFilePath
    });
  }).then(() => {
    // Thumbnail Configurations
    console.log('Thumbnail Configuration start.');
    const thumbFile = bucket.file(thumbFilePath);
    const config = {
      action: 'read',
      expires: '01-01-2500' // should expire somewhere far in the future
    };
    return Promise.all([ // returns an array of Promisses
      thumbFile.getSignedUrl(config),
      file.getSignedUrl(config)
    ]);
  }).then(results => {
    console.log('URL Reference will be deployed to the Database.');
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
      console.log('Return TitleImage Info from Courses.');
      return ref.child(`/courses/${courseId}`).update({
        titleImageId: key,
        titleImageUrl: fileUrl,
        thumbTitleImageUrl: thumbFileUrl,
        titleImageName: fileName
      });
    }

    // if filePath matches nothing, should never happen, but just to be sure
    if (!filePath.includes('/courses/') && !filePath.includes('photo')) {
      return ref.child(`/thumbnails/${profileUid}`).push({
        originalFileUrl: fileUrl,
        thumbnailFileUrl: thumbFileUrl,
        fileName: fileName
      });
    }
  });

});
