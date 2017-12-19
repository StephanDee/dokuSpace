import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated'
import {ReactiveFormsModule } from '@angular/forms';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/signup/signup';
import { ProfileCreatePage } from '../pages/profile/profile-create';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfileTabPage } from '../pages/profile/profile-tab';
import { CourseTabPage } from '../pages/course/course-tab';
import { FavouriteTabPage } from '../pages/favourite/favourite-tab';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    SignUpPage,
    ProfileCreatePage,
    TabsPage,
    ProfileTabPage,
    CourseTabPage,
    FavouriteTabPage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(FIREBASE_CONFIG),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    ReactiveFormsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    SignUpPage,
    ProfileCreatePage,
    TabsPage,
    ProfileTabPage,
    CourseTabPage,
    FavouriteTabPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
