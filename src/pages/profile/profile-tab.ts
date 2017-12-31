import { Component } from '@angular/core';
import {
  AlertController,
  LoadingController,
  MenuController,
  ModalController,
  NavController,
  ItemSliding
} from 'ionic-angular';
import { BasePage } from '../base/base';
import { FirebaseObjectObservable } from "angularfire2/database-deprecated";
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { Profile } from '../../models/profile';
import { ProfileNameModalPage } from '../modal/profilename-modal';
import { ProfileEmailModalPage } from '../modal/profileemail-modal';
import { FileService } from '../../services/file.service';

@Component({
  selector: 'page-profile-tab',
  templateUrl: 'profile-tab.html',
  providers: [ProfileService, AuthService, FileService]
})
export class ProfileTabPage extends BasePage {

  protected profileData: FirebaseObjectObservable<Profile>;

  /**
   *
   * @param {NavController} navCtrl
   * @param {AlertController} alertCtrl
   * @param {LoadingController} loadingCtrl
   * @param {MenuController} menuCtrl
   * @param {ModalController} modalCtrl
   * @param {AuthService} authService
   * @param {ProfileService} profileService
   * @param {FileService} fileService
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              protected menuCtrl: MenuController,
              protected modalCtrl: ModalController,
              private authService: AuthService,
              private profileService: ProfileService,
              private fileService: FileService) {
    super(navCtrl, alertCtrl, loadingCtrl);
    this.menuCtrl.enable(false);
  }

  async ngOnInit() {
    this.createLoading('Profil wird geladen...');
    this.getUserProfileData();
  }

  protected getUserProfileData() {
    this.loading.present();
    const authUid = this.authService.getAuthUid();
    this.profileData = this.profileService.getProfile(authUid);
    this.loading.dismiss();
  }

  protected userSignOut() {
    this.authService.logout();
  }

  protected deleteProfilePhoto() {
    this.showConfirm('Profilbild löschen', 'Möchten Sie das Profilbild wirklich löschen?', this.cancelHandler, this.agreeHandler);
  }

  private cancelHandler = () => {
  };
  private agreeHandler = () => {
    this.createLoading('Profilbild wird gelöscht...');
    this.loading.present();
    const authUid = this.authService.getAuthUid();

    this.profileService.getProfileSubscription(authUid).then((data) => {

      let photoName = data.photoName;
      let photoURL = Profile.DEFAULT_PHOTOURL;

      if (photoName !== undefined) {
        this.fileService.deleteProfileImage(authUid, photoName);
        this.profileService.setProfilePhotoName(authUid, null);
        this.profileService.setProfilePhotoURL(authUid, photoURL);
        this.loading.dismiss();
      } else {
        this.showAlert('Profilbild', 'Es ist kein Profilbild vorhanden.')
      }
      this.loading.dismiss();
    }).catch((err) => {
      this.loading.dismiss();
      alert(err);
    });
    this.profileService.unsubscribeGetProfileSubscription();
  };

  protected chooseAndUploadProfilePhoto() {
    this.fileService.chooseAndUploadProfileImage();
  }

  protected editProfileName(slidingItemName: ItemSliding) {
    slidingItemName.close();
    let modal = this.modalCtrl.create(ProfileNameModalPage);
    modal.present();
  }

  protected editProfileEmail(slidingItemEmail: ItemSliding) {
    slidingItemEmail.close();
    let modal = this.modalCtrl.create(ProfileEmailModalPage);
    modal.present();
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true);
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(false);
  }
}
