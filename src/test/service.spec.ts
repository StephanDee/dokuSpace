import {} from 'jasmine';
import { async, TestBed, inject } from '@angular/core/testing';
import { IonicModule } from 'ionic-angular';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { CourseService } from '../services/course.service';
import { Profile } from '../models/profile';
import { MyApp } from '../app/app.component';
import { BasePage } from '../pages/base/base';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FIREBASE_CONFIG } from '../app/app.firebase.config';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { ContentService } from '../services/content.service';

/**
 * service Test Spec.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */

// xdescribe not to test, fdescribe to force test
// just to check how jasmine + karma unit testing works
describe('My first Test', () => {

  let expected = '';
  let notExpected = '';
  let expectMatch = null;

  beforeEach(async(() => {
    expected = 'helloTest';
    notExpected = 'helloWorld';
    expectMatch = new RegExp(/^hello/);

    TestBed.configureTestingModule({
      declarations: [
        MyApp
      ],
      imports: [
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(FIREBASE_CONFIG),
        AngularFireAuthModule,
        AngularFireDatabaseModule
      ],
      providers: [AuthService]
    })
  }));

  it('should be a helloTest String.', () => {
    expect('helloTest').toBe(expected);
  });

  it('should not be a helloTest String.', () => {
    expect('helloTest').not.toBe(notExpected);
  });

  it('should start with hello', () => {
    expect('helloTest').toMatch(expectMatch);
  });

  it('should have AuthService',
    inject([AuthService], (authService: AuthService) => {
      expect(authService).toBeTruthy();
    }));

  it('should have register function (AuthService)',
    inject([AuthService], (authService: AuthService) => {
      expect(authService.register).toBeTruthy();
    }));

  afterEach(() => {
    // do something after
  });
});

describe('Client+Firebase AuthService and ProfileService Test', () => {

  beforeEach((() => {

    // setTimeout(function(){}, 500);

    TestBed.configureTestingModule({
      declarations: [
        MyApp
      ],
      imports: [
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(FIREBASE_CONFIG),
        AngularFireAuthModule,
        AngularFireDatabaseModule
      ],
      providers: [AuthService, ProfileService]
    })
  }));

  it('should have ProfileService.',
    inject([AuthService], (authService: AuthService) => {
      expect(authService).toBeTruthy();
    }));

  it('should have ProfileService.',
    inject([ProfileService], (profileService: ProfileService) => {
      expect(profileService).toBeTruthy();
    }));

  // do not test anything else with this account t99@t99.t99
  it('should add Profile after Registration and delete User and Profile afterwards (AuthService, ProfileService).',
    inject([AuthService, ProfileService], async (authService: AuthService, profileService: ProfileService) => {

      // register test account
      await authService.register('t99@t99.t99', 't99t99');

      // get authUid
      let authUid = await authService.getAuthUid();

      // Check database entry values of the user
      await profileService.getProfileSubscription(authUid).then((data) => {
        let email = data.email;
        let emailVerified = data.emailVerified;
        let photoURL = data.photoURL;
        let thumbPhotoURL = data.thumbPhotoURL;
        let superAdmin = data.superAdmin;
        expect(email).toBe('t99@t99.t99');
        expect(emailVerified).toBeFalsy();
        expect(photoURL).toBe(Profile.DEFAULT_PHOTOURL);
        expect(thumbPhotoURL).toBe(Profile.DEFAULT_PHOTOURL);
        expect(superAdmin).toBeFalsy();
      });
      await profileService.unsubscribeGetProfileSubscription();

      // delete
      await authService.getCurrentUser().delete();
    }));

  // do not test anything else with this account and dont register t102@t102.t102!
  it('should update auth Email (AuthService).',
    inject([AuthService], async (authService: AuthService) => {

      let currentEmail = 't101@t101.t101';
      let newEmail = 't102@t102.t102';

      // login test account
      await authService.login(currentEmail, 't101t101');

      // if failed run this + comment above line and following 3 lines out
      // await authService.login(newEmail, 't101t101');

      await authService.updateAuthEmail(newEmail);
      let email = await authService.getAuthEmail();
      await expect(email).toBe(newEmail);

      await authService.updateAuthEmail(currentEmail);
      let updatedEmail = await authService.getAuthEmail();
      await expect(updatedEmail).toBe(currentEmail);

      await authService.logout();
    }));

  it('should set ProfileName + limitation Tests (ProfileService).',
    inject([AuthService, ProfileService], async (authService: AuthService, profileService: ProfileService) => {

      // normal Test
      let userName = 'Teacher 100';

      // min 1, max 25, limitation test
      let minName = 'a';
      let maxName = 'aaaaaaaaaaaaaaaaaaaaaaaaa';

      // fail Tests
      // let lowerMinName = '';
      // let higherMaxName = 'aaaaaaaaaaaaaaaaaaaaa';
      // let blankName = ' ';

      // login test account
      await authService.login('t100@t100.t100', 't100t100');

      // get authUid
      let authUid = await authService.getAuthUid();

      // normal Test
      await profileService.setProfileName(authUid, userName);
      // Check database entry values of the User
      await profileService.getProfileSubscription(authUid).then((data) => {
        let name = data.name;
        expect(name).toBe(userName);
        expect(name).toMatch(BasePage.REGEX_START_NOBLANK);
      });
      await profileService.unsubscribeGetProfileSubscription();

      // min Test
      await profileService.setProfileName(authUid, minName);
      await profileService.getProfileSubscription(authUid).then((data) => {
        let name = data.name;
        expect(name).toBe(minName);
        expect(name).toMatch(BasePage.REGEX_START_NOBLANK);
      });
      await profileService.unsubscribeGetProfileSubscription();

      // max Test
      await profileService.setProfileName(authUid, maxName);
      await profileService.getProfileSubscription(authUid).then((data) => {
        let name = data.name;
        expect(name).toBe(maxName);
        expect(name).toMatch(BasePage.REGEX_START_NOBLANK);
      });
      await profileService.unsubscribeGetProfileSubscription();

      // lower min Test
      // await expect(function() {
      //   profileService.setProfileName(authUid, lowerMinName);
      // }).toThrow(new Error('Name muss mind. 1 und max. 25 Zeichen lang sein.'));

      // set back to Default
      await profileService.deleteProfileNameTESTONLY(authUid);
      await profileService.getProfileSubscription(authUid).then((data) => {
        let name = data.name;
        expect(name).not.toBeDefined();
      });
      await profileService.unsubscribeGetProfileSubscription();

      await authService.logout();
    }));

  it('should set Email, EmailVerified, PhotoUrl (ProfileService).',
    inject([AuthService, ProfileService], async (authService: AuthService, profileService: ProfileService) => {

      // prevent timeout_interval error -> extend time
      jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

      let currentEmail = 't100@t100.t100';
      let newEmail = 't105@t105.t105';
      let newPhotoURL = 'https://firebasestorage.googleapis.com/v0/b/dokuspace-67e76.appspot.com/o/test.JPG';

      // login test account
      await authService.login('t100@t100.t100', 't100t100');
      // if failed start from newEmail
      // await authService.login('t105@t105.t105', 't100t100');

      // get authUid
      let authUid = await authService.getAuthUid();

      await authService.updateAuthEmail(newEmail);
      await profileService.setProfileEmail(authUid, newEmail);
      await profileService.setProfileEmailVerified(authUid, true);
      await profileService.setProfilePhotoURL(authUid, newPhotoURL);
      await profileService.setProfileThumbPhotoURL(authUid, newPhotoURL);

      // Check database entry values of the User
      await profileService.getProfileSubscription(authUid).then((data) => {
        let email = data.email;
        let emailVerified = data.emailVerified;
        let photoURL = data.photoURL;
        let thumbPhotoURL = data.thumbPhotoURL;
        expect(email).toBe(newEmail);
        expect(emailVerified).toBeTruthy();
        expect(photoURL).toBe(newPhotoURL);
        expect(thumbPhotoURL).toBe(newPhotoURL);
      });
      await profileService.unsubscribeGetProfileSubscription();

      // set all back to default
      await authService.updateAuthEmail(currentEmail);
      await profileService.setProfileEmail(authUid, currentEmail);
      await profileService.setProfileEmailVerified(authUid, false);
      await profileService.updateProfilePhotoURLToDefault(authUid); // updates both thumbPhotoUrl and photoUrl
      // and check
      await profileService.getProfileSubscription(authUid).then((data) => {
        let email = data.email;
        let emailVerified = data.emailVerified;
        let photoURL = data.photoURL;
        let thumbPhotoUrl = data.thumbPhotoURL;
        expect(email).toBe(currentEmail);
        expect(emailVerified).toBeFalsy();
        expect(photoURL).toBe(Profile.DEFAULT_PHOTOURL);
        expect(thumbPhotoUrl).toBe(Profile.DEFAULT_PHOTOURL);
      });
      await profileService.unsubscribeGetProfileSubscription();

      await authService.logout();
    }));

  afterEach(() => {
    // do something after
  });
});

describe('Client+Firebase CourseServiceTest', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MyApp
      ],
      imports: [
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(FIREBASE_CONFIG),
        AngularFireAuthModule,
        AngularFireDatabaseModule
      ],
      providers: [AuthService, CourseService]
    })
  }));

  it('should have AuthService and CourseService.',
    inject([AuthService, CourseService], (authService: AuthService, courseService: CourseService) => {
      expect(authService).toBeTruthy();
      expect(courseService).toBeTruthy();
    }));

  it('should create a new Course, edit and delete it afterwards.',
    inject([AuthService, CourseService], async (authService: AuthService, courseService: CourseService) => {

      await authService.login('t103@t103.t103', 't103t103');

      let authUid = await authService.getAuthUid();

      // Dummy Inputs
      let courseId = courseService.createCourseId();
      let title = 'Jasmine + Karma';
      let description = 'Learn how to use BDD Test Envirements.';
      let creatorName = 'Teacher 103';
      let creatorUid = authUid;
      let creatorPhotoURL = Profile.DEFAULT_PHOTOURL;
      let thumbCreatorPhotoURL = Profile.DEFAULT_PHOTOURL;

      await courseService.createCourse(courseId, title, description, creatorName, creatorUid, creatorPhotoURL, thumbCreatorPhotoURL);

      await courseService.getCourseSubscription(courseId).then((data) => {
        let courseIdData = data.courseId;
        let titleData = data.title;
        let descriptionData = data.description;
        let creatorNameData = data.creatorName;
        let creatorUidData = data.creatorUid;
        let creatorPhotoURLData = data.creatorPhotoURL;
        let thumbCreatorPhotoURLData = data.thumbCreatorPhotoURL;
        expect(courseIdData).toBe(courseId);
        expect(titleData).toBe(title);
        expect(descriptionData).toBe(description);
        expect(creatorNameData).toBe(creatorName);
        expect(creatorUidData).toBe(creatorUid);
        expect(creatorPhotoURLData).toBe(creatorPhotoURL);
        expect(thumbCreatorPhotoURLData).toBe(thumbCreatorPhotoURL);
      });
      await courseService.unsubscribeGetCourseSubscription();

      // edit Data
      let newTitle = 'Angular';
      let newDescription = 'Learn how to work with Angular.';

      // update Title and Description
      await courseService.updateCourseTitleAndDescription(courseId, newTitle, newDescription);

      // check new Title and Desription
      await courseService.getCourseSubscription(courseId).then((data) => {
        let titleData = data.title;
        let descriptionData = data.description;
        expect(titleData).toBe(newTitle);
        expect(descriptionData).toBe(newDescription);
      });
      await courseService.unsubscribeGetCourseSubscription();

      // delete course
      await courseService.deleteCourse(courseId);

      await authService.logout();
    }));

  afterEach(() => {
    // do something after
  });
});

describe('Client+Firebase ContentServiceTest', () => {

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        MyApp
      ],
      imports: [
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(FIREBASE_CONFIG),
        AngularFireAuthModule,
        AngularFireDatabaseModule
      ],
      providers: [AuthService, CourseService, ContentService]
    })
  }));

  it('should have AuthService and ContentService.',
    inject([AuthService, CourseService, ContentService], (authService: AuthService, courseService: CourseService, contentService: ContentService) => {
      expect(authService).toBeTruthy();
      expect(courseService).toBeTruthy();
      expect(contentService).toBeTruthy();
    }));

  it('should create a new Course, then create a Content edit it and delete both afterwards.',
    inject([AuthService, CourseService, ContentService], async (authService: AuthService, courseService: CourseService, contentService: ContentService) => {

      await authService.login('t103@t103.t103', 't103t103');

      let authUid = await authService.getAuthUid();

      // Course Dummy Inputs
      let courseId = courseService.createCourseId();
      let title = 'Jasmine + Karma';
      let description = 'Learn how to use BDD Test Envirements.';
      let creatorName = 'Teacher 103';
      let creatorUid = authUid;
      let creatorPhotoURL = Profile.DEFAULT_PHOTOURL;
      let thumbCreatorPhotoURL = Profile.DEFAULT_PHOTOURL;

      // create course for content
      await courseService.createCourse(courseId, title, description, creatorName, creatorUid, creatorPhotoURL, thumbCreatorPhotoURL);

      // Content Dummy Inputs
      let contentId = courseService.createCourseId();
      let contentTitle = 'Jasmine + Karma';
      let contentDescription = 'Learn how to use BDD Test Envirements.';
      let videoName = 'test.mp4';
      let videoUrl = Profile.DEFAULT_PHOTOURL;

      // create content
      await contentService.createContent(authUid, courseId, contentId, contentTitle, contentDescription, videoName, videoUrl);

      await contentService.getContentSubscription(courseId, contentId).then((data) => {
        let contentIdData = data.contentId;
        let titleData = data.title;
        let descriptionData = data.description;
        let creatorUidData = data.creatorUid;
        let videoIdData = data.videoId;
        let videoNameData = data.videoName;
        let videoUrlData = data.videoUrl;
        expect(contentIdData).toBe(contentId);
        expect(titleData).toBe(contentTitle);
        expect(descriptionData).toBe(contentDescription);
        expect(creatorUidData).toBe(creatorUid);
        expect(videoIdData).not.toBe(undefined);
        expect(videoNameData).toBe(videoName);
        expect(videoUrlData).toBe(videoUrl);
      });
      await contentService.unsubscribeGetContentSubscription();

      let newTitle = 'Angular';
      let newDescription = 'Learn how to use Angular.';

      // edit content
      await contentService.updateContentTitleAndDescription(courseId, contentId, newTitle, newDescription);

      await contentService.getContentSubscription(courseId, contentId).then((data) => {
        let titleData = data.title;
        let descriptionData = data.description;
        expect(titleData).toBe(newTitle);
        expect(descriptionData).toBe(newDescription);
      });
      await contentService.unsubscribeGetContentSubscription();

      // delete content
      await contentService.deleteContent(courseId);

      // delete course
      await courseService.deleteCourse(courseId);

      await authService.logout();
    }));

  afterEach(() => {
    // do something after
  });
});
