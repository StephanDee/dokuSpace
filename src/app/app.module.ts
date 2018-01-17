import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AngularFireModule } from 'angularfire2';
import { FIREBASE_CONFIG } from './app.firebase.config';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database-deprecated'
import { ReactiveFormsModule } from '@angular/forms';

import { MyApp } from './app.component';

import { LoginPage } from '../pages/login/login';
import { SignUpPage } from '../pages/signup/signup';
import { ProfileCreatePage } from '../pages/profile/profile-create';
import { TabsPage } from '../pages/tabs/tabs';
import { ProfileTabPage } from '../pages/profile/profile-tab';
import { CourseTabPage } from '../pages/course/course-tab';
import { FavouriteTabPage } from '../pages/favourite/favourite-tab';
import { CourseContentListPage } from '../pages/course/course-contentlist';
import { ContentPage } from '../pages/content/content-page';
import { ProfileNameModalPage } from '../pages/profile/modals/profile-name-modal';
import { ProfileEmailModalPage } from '../pages/profile/modals/profile-email-modal';
import { CourseCreateModalPage } from '../pages/course/modals/course-create-modal';
import { CourseEditModalPage } from '../pages/course/modals/course-edit-modal';
import { ContentCreateModalPage } from '../pages/content/modals/content-create-modal';
import { ContentEditModalPage } from '../pages/content/modals/content-edit-modal';
import { ProfileListPage } from '../pages/admin/profilelist/profilelist';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { FileChooser } from '@ionic-native/file-chooser';
import { FilePath } from '@ionic-native/file-path';
import { File } from '@ionic-native/file';

/**
 * This is the Module of the App.
 * In here all Pages, Modules, Providers must be initialized for usage.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
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
    CourseContentListPage,
    ContentPage,
    ProfileNameModalPage,
    ProfileEmailModalPage,
    CourseCreateModalPage,
    CourseEditModalPage,
    ContentCreateModalPage,
    ContentEditModalPage,
    ProfileListPage
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
    FavouriteTabPage,
    CourseContentListPage,
    ContentPage,
    ProfileNameModalPage,
    ProfileEmailModalPage,
    CourseCreateModalPage,
    CourseEditModalPage,
    ContentCreateModalPage,
    ContentEditModalPage,
    ProfileListPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileChooser,
    FilePath,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
