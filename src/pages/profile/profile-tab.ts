import { Component } from '@angular/core';
import { AlertController, LoadingController, MenuController, ModalController, NavController, ItemSliding } from 'ionic-angular';
import { BasePage } from '../base/base';
import { FirebaseObjectObservable } from "angularfire2/database-deprecated";
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs/Subscription';
import { Profile } from '../../models/profile';
import { ProfileNameModalPage } from '../modal/profilename-modal';
import { ProfileEmailModalPage } from '../modal/profileemail-modal';

@Component({
  selector: 'page-profile-tab',
  templateUrl: 'profile-tab.html',
  providers: [ProfileService, AuthService]
})
export class ProfileTabPage extends BasePage {

  public deleteUserPhotoURLConfirmed: boolean;
  protected userAuthSubscription: Subscription;
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
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              protected menuCtrl: MenuController,
              protected modalCtrl: ModalController,
              private authService: AuthService,
              private profileService: ProfileService) {
    super(navCtrl, alertCtrl, loadingCtrl);
    this.menuCtrl.enable(false);
  }

  async ngOnInit() {
    this.createLoading('Profil wird geladen...');
    this.getUserProfileData();
  }

  protected getUserProfileData() {
    this.loading.present();
    this.userAuthSubscription = this.authService.getAuthState().subscribe((auth) => {
      if (auth && auth.email && auth.uid) {
        this.profileData = this.profileService.getProfile(auth.uid);
      }
    });
    this.loading.dismiss();
  }

  protected unsubscribeUserProfileData() {
    this.userAuthSubscription.unsubscribe();
  }

  protected userSignOut() {
    this.unsubscribeUserProfileData();
    this.authService.logout();
  }

  protected deleteUserPhotoURL() {
    if (this.deleteUserPhotoURLConfirmed == false) {
      this.showAlert('Profilbild', 'Es ist kein Profilbild vorhanden.')
    } else {
      let cancelHandler = () => {
      };
      let agreeHandler = () => {
        this.deleteUserPhotoURLConfirmed = true;
      };
      this.showConfirm('Profilbild löschen', 'Möchten Sie das Profilbild wirklich löschen?', cancelHandler(), agreeHandler());
    }
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
    this.unsubscribeUserProfileData();
    this.menuCtrl.enable(false);
  }
}
