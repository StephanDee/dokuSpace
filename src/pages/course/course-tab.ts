import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { ProfileCreatePage } from "../profile/profile-create";
// import { AngularFireAuth } from "angularfire2/auth";
// import { AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database-deprecated";
// import { Profile } from "../../models/profile";
// import { Subscription } from "rxjs/Subscription";
import { BasePage } from "../base/base";

@Component({
  selector: 'page-course-tab',
  templateUrl: 'course-tab.html'
})
export class CourseTabPage extends BasePage {

  // protected userAuthSubscription: Subscription;
  // protected userProfileDataSubscription: Subscription;
  // protected profileData: FirebaseObjectObservable<Profile>;

  constructor(public navCtrl: NavController
              // private authService: AuthService,
              // private profileService: ProfileService,
              // protected afAuth: AngularFireAuth,
              // protected afDb: AngularFireDatabase
              ) {
    super(navCtrl);
  }

  async ngOnInit() {
  }

}
