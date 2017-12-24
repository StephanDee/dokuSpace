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
  selector: 'page-profileemail-modal',
  templateUrl: 'profileemail-modal.html',
  providers: [AuthService, ProfileService]
})
export class ProfileEmailModalPage extends BasePage {

  protected profileEmailModalForm: FormGroup;

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
    this.profileEmailModalForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(ProfileEmailModalPage.REGEX_EMAIL)]]
    });
  }

  protected setNewProfileEmail() {
    if (this.profileEmailModalForm.invalid) {
      this.showAlert('Profil', 'Bitte Formularfelder richtig ausfüllen.');
    }
    // Update Auth Email
    this.authService.updateAuthEmail(this.profileEmailModalForm.value.email);

    // TODO: This change with Cloud Function Auth Trigger
    this.loading.present();

    // get Auth Uid
    const authUid = this.authService.getAuthUid();

    // set Profile Email
    this.profileService.setProfileEmail(authUid, this.profileEmailModalForm.value.email)
      .then(() => {
        this.dismiss();
      }).catch((err) => {
      this.showAlert('Profil', 'Ein Fehler ist aufgetreten.');
      console.error(err);
    });
    this.loading.dismiss();
  }

  // close Modal View
  protected dismiss() {
    this.viewCtrl.dismiss();
  }

}
