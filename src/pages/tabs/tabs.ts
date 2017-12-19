import { Component } from '@angular/core';
import { ProfileTabPage } from '../profile/profile-tab';
import { CourseTabPage } from '../course/course-tab';
import { FavouriteTabPage } from '../favourite/favourite-tab';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Subscription } from 'rxjs/Subscription';
import { ProfileCreatePage } from "../profile/profile-create";
import { NavController } from "ionic-angular";

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  protected userAuthSubscription: Subscription;
  protected userProfileDataSubscription: Subscription;

  tab1Root = ProfileTabPage;
  tab2Root = CourseTabPage;
  tab3Root = FavouriteTabPage;

  constructor(public navCtrl: NavController,
              protected afAuth: AngularFireAuth,
              protected afDb: AngularFireDatabase) {
  }

  async ngOnInit() {
    this.getUserProfileData();
  }

  protected getUserProfileData() {
    this.userAuthSubscription = this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {

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
