import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from '../../models/profile';
import { AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database-deprecated";
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { ProfileCreatePage } from './profile-create';
import { Subscription } from "rxjs/Subscription";

@Component({
  selector: 'page-profile-tab',
  templateUrl: 'profile-tab.html',
  providers: [ProfileService, AuthService]
})
export class ProfileTabPage extends BasePage {

  protected userAuthSubcription: Subscription;
  protected userProfileDataSubcription: Subscription;
  protected profileData: FirebaseObjectObservable<Profile>;

  constructor(public navCtrl: NavController,
              private authService: AuthService,
              // private profileService: ProfileService,
              protected afAuth: AngularFireAuth,
              protected afDb: AngularFireDatabase) {
    super(navCtrl);
  }

  async ngOnInit() {
    this.getUserProfileData();
    // this.profileService.getUserProfile();
  }

  protected getUserProfileData() {
    this.userAuthSubcription = this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
        this.profileData = this.afDb.object(`profiles/${data.uid}`);

        this.userProfileDataSubcription = this.afDb.object(`profiles/${data.uid}`).subscribe(user => {
          console.log(user.name);
          if (user.name === undefined) {
            this.navCtrl.setRoot(ProfileCreatePage);
          }
        });
      }
    });
  }

  protected unsubscribeUserProfileData() {
    this.userAuthSubcription.unsubscribe();
    this.userProfileDataSubcription.unsubscribe();
  }


  protected userSignOut() {
    this.unsubscribeUserProfileData();
    this.authService.logout();
  }
}
