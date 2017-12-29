// 'use strict';
// const functions = require('firebase-functions');
// const admin = require('firebase-admin');
// admin.initializeApp(functions.config().firebase);
//
// const database = admin.database();
// const rootRef = database.ref('test');
//
// const testProfile = {
//   uid: 'fake-uid',
//   email: 'developer@test.test',
//   password: '123456',
//   displayName: 'Developer Test',
//   photoURL: 'https://image.test',
//   disabled: false,
//   emailVerified: false
// };
//
// function cleanUp(done) {
//   return rootRef.remove().then(done);
// }
//
// beforeEach(done => cleanUp(done));
// afterAll(done => cleanUp(done));
//
// describe('createProfile', () => {
//   let testUser, userRef, event, createProfileFunction;
//   beforeEach(() => {
//     const profile = new createProfile(testProfile);
//
//     userRef = rootRef.child('users').child(testUser.uid);
//     event = null;
//   });
//
//   it('should process auth createProfile', done => {
//
//     createProfileFunction(event).then(() => userRef.once('value')).then(snap => {
//       const user = snap.val();
//       expect(user.uid).toEqual(testUser.uid);
//       done();
//     });
//   });
// });
