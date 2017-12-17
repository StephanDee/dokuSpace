import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireAuth } from 'angularfire2/auth';

import { LoginPage } from "../pages/login/login";
import { ProfileCreatePage } from '../pages/profile/profile-create';
import { TabsPage } from "../pages/tabs/tabs";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any;

  /**
   *
   * @param {Platform} platform
   * @param {StatusBar} statusBar
   * @param {SplashScreen} splashScreen
   * @param {AngularFireAuth} afAuth
   */
  constructor(public platform: Platform,
              public statusBar: StatusBar,
              public splashScreen: SplashScreen,
              public afAuth: AngularFireAuth) {

    // Authenticate if user is signed in or signed out
    afAuth.authState.subscribe(user => {
      if (user) {
        this.rootPage = TabsPage;
      } else {
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
}
