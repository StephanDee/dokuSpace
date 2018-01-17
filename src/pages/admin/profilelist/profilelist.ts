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

/**
 * This class represents the ProfileListPage.
 * A SuperAdmin can change the Roles of The Users in this Page.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  selector: 'page-profilelist',
  templateUrl: 'profilelist.html',
  providers: [AuthService, ProfileService]
})
export class ProfileListPage extends BasePage {

  protected profileData: FirebaseListObservable<Profile>;

  /**
   * This is the Constructor of ProfileList.
   * Provides Components for Usage.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {ToastController} toastCtrl The Toast Controller
   * @param {ActionSheetController} actionSheetCtrl The ActionSheet Controller
   * @param {ProfileService} profileService The ProfileService, provides Methods for Profiles
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              protected toastCtrl: ToastController,
              protected actionSheetCtrl: ActionSheetController,
              private profileService: ProfileService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  /**
   * Loads the List of Profiles, to be displayed in the HTML
   */
  ngOnInit() {
    this.profileData = this.profileService.getProfiles();
  }

  /**
   * Selects the selected ProfileItem and open an Action Sheet with 3 options.
   * Edit, Delete, Cancel.
   *
   * @param {Profile} profile The Profile to work with
   */
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

  /**
   * Success Toast, the Role of a Profile was successfully changed.
   */
  protected roleSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Rolle wurde erfolgreich geändert.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

}
