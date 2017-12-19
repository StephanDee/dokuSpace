import { Component } from '@angular/core';
import { ProfileTabPage } from '../profile/profile-tab';
import { CourseTabPage } from '../course/course-tab';
import { FavouriteTabPage } from '../favourite/favourite-tab';
import { Subscription } from 'rxjs/Subscription';
import { ProfileCreatePage } from '../profile/profile-create';
import { NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

@Component({
  templateUrl: 'tabs.html',
  providers: [AuthService, ProfileService]
})
export class TabsPage {

  protected userAuthSubscription: Subscription;
  protected userProfileDataSubscription: Subscription;

  tab1Root = ProfileTabPage;
  tab2Root = CourseTabPage;
  tab3Root = FavouriteTabPage;

  constructor(public navCtrl: NavController,
              protected authService: AuthService,
              protected profileService: ProfileService) {
  }

  async ngOnInit() {
    this.getUserProfileData();
  }

  protected getUserProfileData() {
    this.userAuthSubscription = this.authService.getAuthState().subscribe(data => {
      if (data && data.email && data.uid) {

        this.userProfileDataSubscription = this.profileService.getProfile(data.uid).subscribe(user => {
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
