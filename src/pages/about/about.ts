import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ProfileCreatePage } from "../profile/profile-create";
import { AngularFireAuth } from "angularfire2/auth";
import { AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database-deprecated";
import { Profile } from "../../models/profile";
import { Subscription } from "rxjs/Subscription";
import { BasePage } from "../base/base";

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage extends BasePage {

  protected userAuthSubscription: Subscription;
  protected userProfileDataSubscription: Subscription;
  protected profileData: FirebaseObjectObservable<Profile>;

  constructor(public navCtrl: NavController,
              // private authService: AuthService,
              // private profileService: ProfileService,
              protected afAuth: AngularFireAuth,
              protected afDb: AngularFireDatabase) {
    super(navCtrl);
  }

  async ngOnInit() {
    this.getUserProfileData();
  }

  protected getUserProfileData() {
    this.userAuthSubscription = this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.profileData = this.afDb.object(`profiles/${data.uid}`);

        this.userProfileDataSubscription = this.afDb.object(`profiles/${data.uid}`).subscribe(user => {
          console.log(user.name);
          if (user.name === undefined) {
            this.navCtrl.setRoot(ProfileCreatePage);
          } else {
            this.userProfileDataSubscription.unsubscribe();
          }
        });
      }
    });
  }

  protected unsubscribeUserProfileData() {
    this.userAuthSubscription.unsubscribe();
    this.userProfileDataSubscription.unsubscribe();
  }

  ionViewDidLeave() {
    this.unsubscribeUserProfileData();
  }

}
