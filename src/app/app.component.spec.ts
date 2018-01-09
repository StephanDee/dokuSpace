import {} from 'jasmine';
import { async, TestBed, inject } from '@angular/core/testing';
import { IonicModule, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { PlatformMock, StatusBarMock, SplashScreenMock } from '../../test-config/mocks-ionic';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { TestService } from '../services/test.service';
import { MyApp } from './app.component';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated';


// x not to test, f to force test
describe('MyApp Component', () => {
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

  // Cannot read property 'length' of undefined ERROR
  // it('should have two pages', () => {
  //   expect(component.pages.length).toBe(2);
  // });

});

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
      providers: [TestService, AuthService]
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

  it('should have TestService',
    inject([TestService], (testService: TestService) => {
      expect(testService).toBeTruthy();
    }));

  it('should have add function (TestService)',
    inject([TestService], (testService: TestService) => {
      expect(testService.add).toBeTruthy();
    }));

  it('should add correctly (TestService)',
    inject([TestService], (testService: TestService) => {
      expect(testService.add(1, 2)).toEqual(3);
    }));

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

describe('Firebase Services Test', () => {

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
      providers: [TestService, AuthService, ProfileService]
    })
  }));

  it('should add TestService.',
    inject([TestService], (testService: TestService) => {
      expect(testService).toBeTruthy();
    }));

  // it('should get test value with getTestSubscription() method from (TestService).',
  //   inject([TestService], (testService: TestService) => {
  //
  //     testService.getTestSubscription().then(async (data) => {
  //       let test = data.test;
  //       expect(test).toBe('Tester');
  //     });
  //   }));

  it('should test register function (AuthService, ProfileService).',
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
        expect(photoURL).toBe('https://firebasestorage.googleapis.com/v0/b/dokuspace-67e76.appspot.com/o/defaultprofile_430x300.jpg?alt=media&token=a06a7924-cca4-4995-bee5-c8be08aa3815');
        expect(superAdmin).toBeFalsy();
      });

      // after test is done delete User.
      await authService.getCurrentUser().delete();
    }));

  it('should add ProfileService.',
    inject([ProfileService], (profileService: ProfileService) => {
      expect(profileService).toBeTruthy();
    }));


  afterEach(() => {
    // do something after
  });
});
