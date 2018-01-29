import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { Subscription } from 'rxjs/Subscription';

import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfileCreatePage } from '../pages/profile/profile-create';
import { ProfileListPage } from '../pages/admin/profilelist/profilelist';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Profile } from '../models/profile';

/**
 * This class represents the initial Page of the App.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  templateUrl: 'app.html',
  providers: [AuthService, ProfileService]
})
export class MyApp {

  // Attributes
  public rootPage: any;
  public profileListPage: any = ProfileListPage;
  public sideMenuState: boolean;
  private profileSubscriptionActive: boolean;

  protected profileData: FirebaseObjectObservable<Profile>;
  private userProfileDataSubscription: Subscription;

  /**
   * The Constructor of MyApp.
   * Initializes the App and roots to the first Page.
   *
   * @param {Platform} platform The Platform of the App
   * @param {StatusBar} statusBar The StatusBar of the App
   * @param {SplashScreen} splashScreen The SplashScreen of the APp
   * @param {AuthService} authService The Auth Service, provides Methods for Authentication
   * @param {ProfileService} profileService The Profile Service, provides Methods for Profiles
   */
  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              private authService: AuthService,
              private profileService: ProfileService) {

    // Authenticate if user is signed in or signed out
    authService.getAuthState().subscribe((auth) => {
      // TODO: after all tests done -> && auth.emailVerified
      if (auth) {
        this.profileSubscriptionActive = true;
        this.userProfileDataSubscription = this.profileService.getProfile(auth.uid).subscribe((user) => {
          // if new User was created open TabsPage
          if (user.name === undefined) {
            this.rootPage = ProfileCreatePage;
          } else {
            if (user.emailVerified === false) {
              this.profileService.setProfileEmailVerified(auth.uid, true);
            }
            this.profileData = this.profileService.getProfile(auth.uid);
            this.sideMenuState = true;
            this.rootPage = TabsPage;
          }
        });
      } else {
        if (this.profileSubscriptionActive) {
          this.userProfileDataSubscription.unsubscribe();
          this.profileSubscriptionActive = false;
        }
        this.sideMenuState = false;
        this.rootPage = LoginPage;
      }
    });
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  /**
   * Opens the ProfileListPage if the User is a SuperAdmin.
   */
  protected openProfileList() {
    this.rootPage = ProfileListPage;
  }

  /**
   * Return to the Root Page.
   */
  protected goBackToRootPage() {
    this.rootPage = MyApp;
  }

  /**
   * Logout.
   */
  protected userSignOut() {
    this.authService.logout();
  }

}
