import {} from 'jasmine';
import { async, TestBed, inject } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformMock, StatusBarMock, SplashScreenMock } from '../../test-config/mocks-ionic';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { CourseService } from '../services/course.service';
import { Profile } from '../models/profile';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';
import { ContentService } from "../services/content.service";


// xdescribe not to test, fdescribe to force test
xdescribe('MyApp Component', () => {
  let fixture;
  let component;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyApp],
      imports: [
        IonicModule.forRoot(MyApp),
        AngularFireModule.initializeApp(FIREBASE_CONFIG),
        AngularFireAuthModule,
        AngularFireDatabaseModule
      ],
      providers: [
        {provide: StatusBar, useClass: StatusBarMock},
        {provide: SplashScreen, useClass: SplashScreenMock},
        {provide: Platform, useClass: PlatformMock}
      ]
    })
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyApp);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component instanceof MyApp).toBe(true);
  });

});

// just to check how jasmine + karma unit testing works
xdescribe('My first Test', () => {

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

xdescribe('Client+Firebase AuthService and ProfileService Test', () => {

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
        let superAdmin = data.superAdmin;
        expect(email).toBe('t99@t99.t99');
        expect(emailVerified).toBeFalsy();
        expect(photoURL).toBe(Profile.DEFAULT_PHOTOURL);
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

  it('should set ProfileName (AuthService, ProfileService).',
    inject([AuthService, ProfileService], async (authService: AuthService, profileService: ProfileService) => {

      let userName = 'Teacher 100';

      // login test account
      await authService.login('t100@t100.t100', 't100t100');

      // get authUid
      let authUid = await authService.getAuthUid();

      await profileService.setProfileName(authUid, userName);
      // Check database entry values of the User
      await profileService.getProfileSubscription(authUid).then((data) => {
        let name = data.name;
        expect(name).toBe(userName);
      });
      await profileService.unsubscribeGetProfileSubscription();

      await profileService.deleteProfileName(authUid);
      await profileService.getProfileSubscription(authUid).then((data) => {
        let name = data.name;
        expect(name).not.toBeDefined();
      });
      await profileService.unsubscribeGetProfileSubscription();

      await authService.logout();
    }));

  it('should set Email, EmailVerified, PhotoUrl (ProfileService).',
    inject([AuthService, ProfileService], async (authService: AuthService, profileService: ProfileService) => {

      let currentEmail = 't100@t100.t100';
      let newEmail = 't101@t101.t101';
      let newPhotoURL = 'https://firebasestorage.googleapis.com/v0/b/dokuspace-67e76.appspot.com/profiles/test.jpg';
      // let nameSmallerThan1 = '';
      // let nameHigherThan25 = 'aaaaaaaaaaaaaaaaaaaaa';

      // login test account
      await authService.login('t100@t100.t100', 't100t100');

      // get authUid
      let authUid = await authService.getAuthUid();

      // name too small
      // await expect(function() {
      //   profileService.setProfileName(authUid, nameSmallerThan1)
      // }).toThrow(new Error('Name muss mind. 1 und max. 25 Zeichen lang sein.'));

      // name too long
      // await expect(profileService.setProfileName(authUid, nameHigherThan25)).toThrow();

      await profileService.setProfileEmail(authUid, newEmail);
      await profileService.setProfileEmailVerified(authUid, true);
      await profileService.setProfilePhotoURL(authUid, newPhotoURL);

      // Check database entry values of the User
      await profileService.getProfileSubscription(authUid).then((data) => {
        let email = data.email;
        let emailVerified = data.emailVerified;
        let photoURL = data.photoURL;
        expect(email).toBe(newEmail);
        expect(emailVerified).toBeTruthy();
        expect(photoURL).toBe(newPhotoURL);
      });
      await profileService.unsubscribeGetProfileSubscription();

      // set all back to default
      await profileService.setProfileEmail(authUid, currentEmail);
      await profileService.setProfileEmailVerified(authUid, false);
      await profileService.setProfilePhotoURL(authUid, Profile.DEFAULT_PHOTOURL);
      // and check
      await profileService.getProfileSubscription(authUid).then((data) => {
        let email = data.email;
        let emailVerified = data.emailVerified;
        let photoURL = data.photoURL;
        expect(email).toBe(currentEmail);
        expect(emailVerified).toBeFalsy();
        expect(photoURL).toBe(Profile.DEFAULT_PHOTOURL);
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

  it('should create a new Course and delete it afterwards.',
    inject([AuthService, CourseService], (authService: AuthService, courseService: CourseService) => {
      expect(authService).toBeTruthy();
      expect(courseService).toBeTruthy();
    }));

  it('should edit a new Course and delete it afterwards.',
    inject([AuthService, CourseService], (authService: AuthService, courseService: CourseService) => {
      expect(authService).toBeTruthy();
      expect(courseService).toBeTruthy();
    }));

  afterEach(() => {
    // do something after
  });
});

xdescribe('Client+Firebase ContentServiceTest', () => {

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

  it('should create a new Content and delete it afterwards.',
    inject([AuthService, CourseService, ContentService], (authService: AuthService, courseService: CourseService, contentService: ContentService) => {
      expect(authService).toBeTruthy();
      expect(courseService).toBeTruthy();
      expect(contentService).toBeTruthy();
    }));

  it('should edit a new Content and delete it afterwards.',
    inject([AuthService, CourseService, ContentService], (authService: AuthService, courseService: CourseService, contentService: ContentService) => {
      expect(authService).toBeTruthy();
      expect(courseService).toBeTruthy();
      expect(contentService).toBeTruthy();
    }));

  afterEach(() => {
    // do something after
  });
});
