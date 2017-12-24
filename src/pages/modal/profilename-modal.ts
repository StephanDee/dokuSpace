import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { BasePage } from '../base/base';

/**
 * This class represents the login-page.
 */
@Component({
  selector: 'page-profilename-modal',
  templateUrl: 'profilename-modal.html',
  providers: [AuthService, ProfileService]
})
export class ProfileNameModalPage extends BasePage {

  protected profileNameModalForm: FormGroup;

  /**
   *
   * @param {NavController} navCtrl
   * @param {AlertController} alertCtrl
   * @param {LoadingController} loadingCtrl
   * @param {ViewController} viewCtrl
   * @param {FormBuilder} formBuilder
   * @param {AuthService} authService
   * @param {ProfileService} profileService
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public viewCtrl: ViewController,
              protected formBuilder: FormBuilder,
              private authService: AuthService,
              private profileService: ProfileService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  async ngOnInit() {
    this.createLoading('Änderungen werden vorgenommen...');
    this.initForm();
  }

  /**
   * Initialize the form.
   */
  protected initForm() {
    this.profileNameModalForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  protected setNewProfileName() {
    if (this.profileNameModalForm.invalid) {
      this.showAlert('Profil', 'Bitte Formularfelder richtig ausfüllen.');
    }
    this.loading.present();
    // get Auth Uid
    const authUid = this.authService.getAuthUid();

    // set profile name
    this.profileService.setProfileName(authUid, this.profileNameModalForm.value.name)
      .then(() => {
        this.dismiss();
      }).catch((err) => {
      this.showAlert('Profil', 'Ein Fehler ist aufgetreten.');
      console.error(err);
    });
    this.loading.dismiss();
  }

  // Close Modal View
  protected dismiss() {
    this.viewCtrl.dismiss();
  }

}
