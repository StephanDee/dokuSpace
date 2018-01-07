import { Component } from '@angular/core';
import { App, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthService } from '../services/auth.service';
import { ProfileService } from '../services/profile.service';
import { Subscription } from 'rxjs/Subscription';

import { LoginPage } from '../pages/login/login';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfileCreatePage } from '../pages/profile/profile-create';
import { ProfileListPage } from "../pages/admin/profilelist/profilelist";
import { FirebaseObjectObservable } from "angularfire2/database-deprecated";
import { Profile } from "../models/profile";

@Component({
  templateUrl: 'app.html',
  providers: [AuthService, ProfileService]
})
export class MyApp {

  public rootPage: any;
  public sideMenuState: boolean;
  protected profileData: FirebaseObjectObservable<Profile>;
  private profileSubscriptionActive: boolean;
  protected userProfileDataSubscription: Subscription;

  /**
   *
   * @param {Platform} platform
   * @param {StatusBar} statusBar
   * @param {SplashScreen} splashScreen
   * @param {AuthService} authService
   * @param {ProfileService} profileService
   */
  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public authService: AuthService,
              public profileService: ProfileService) {

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

  protected openProfileList() {
    this.rootPage = ProfileListPage;
  }

  protected userSignOut() {
    this.authService.logout();
  }

}
