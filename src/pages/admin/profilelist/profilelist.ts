import { Component } from '@angular/core';
import {
  ActionSheetController, AlertController, LoadingController, NavController,
  ToastController
} from 'ionic-angular';
import { BasePage } from '../../base/base';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { Profile } from '../../../models/profile';
import { MyApp } from '../../../app/app.component';

@Component({
  selector: 'page-profilelist',
  templateUrl: 'profilelist.html',
  providers: [AuthService, ProfileService]
})
export class ProfileListPage extends BasePage {

  protected profileData: FirebaseListObservable<Profile>;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public toastCtrl: ToastController,
              protected actionSheetCtrl: ActionSheetController,
              private profileService: ProfileService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  async ngOnInit() {
    this.profileData = this.profileService.getProfiles();
  }

  protected selectProfileItem(profile: Profile) {

    this.actionSheetCtrl.create({
      title: `Profil: ${profile.name}`,
      buttons: [
        {
          text: 'Rolle zu ' + Profile.ROLE_STUDENT + ' ändern',
          handler: () => {
            this.profileService.setProfileRole(profile.$key, Profile.ROLE_STUDENT);
            this.roleSuccessToast();
          }
        },
        {
          text: 'Rolle zu ' + Profile.ROLE_TEACHER + ' ändern',
          handler: () => {
            this.profileService.setProfileRole(profile.$key, Profile.ROLE_TEACHER);
            this.roleSuccessToast();
          }
        },
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    }).present();
  }

  protected goBackToRootPage() {
    this.navCtrl.setRoot(MyApp);
  }

  protected roleSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Rolle wurde erfolgreich geändert.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

}
