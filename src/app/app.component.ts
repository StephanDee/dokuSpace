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

@Component({
  templateUrl: 'app.html',
  providers: [AuthService, ProfileService]
})
export class MyApp {

  public rootPage: any;
  public sideMenuState: boolean;
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
    authService.getAuthState().subscribe(auth => {
      if (auth) {
        this.userProfileDataSubscription = this.profileService.getProfile(auth.uid).subscribe(user => {

          // if new User was created open ProfileCreatePage
          if (user.name === undefined) {
            this.rootPage = ProfileCreatePage;
          } else {
            this.userProfileDataSubscription.unsubscribe();
            this.sideMenuState = true;
            this.rootPage = TabsPage;
          }
        });
      } else {
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

  protected userSignOut() {
    this.authService.logout();
  }
}
