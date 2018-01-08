import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { BasePage } from '../../base/base';

/**
 * This class represents the login-page.
 */
@Component({
  selector: 'page-profile-email-modal',
  templateUrl: './profile-email-modal.html',
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
      currentEmail: ['', [Validators.required, Validators.pattern(ProfileEmailModalPage.REGEX_EMAIL)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.pattern(ProfileEmailModalPage.REGEX_EMAIL)]]
    });
  }

  protected async setNewProfileEmail() {
    if (this.profileEmailModalForm.invalid) {
      this.showAlert('Profil', 'Bitte Formularfelder richtig ausfüllen.');
    }
    // get currentAuth
    const currentAuth = this.authService.getAuthUid();

    // Check if Email === currentEmail else denied
    await this.profileService.getProfileSubscription(currentAuth).then(async (data) => {

      // get currentEmail
      let email = data.email;
      if (email !== this.profileEmailModalForm.value.currentEmail) {
        this.showAlert('Verifikation Fehlgeschlagen', 'Bitte geben Sie ihre E Mail Adresse ein.');
      } else {
        await this.authService.login(this.profileEmailModalForm.value.currentEmail, this.profileEmailModalForm.value.password).then(async () => {
          // get Auth Uid
          const authUid = this.authService.getAuthUid();

          if (currentAuth === authUid) {
            // Update Auth Email
            await this.authService.updateAuthEmail(this.profileEmailModalForm.value.email);

            this.loading.present();

            // set Profile Email
            await this.profileService.setProfileEmail(authUid, this.profileEmailModalForm.value.email)
              .then(() => {
                this.dismiss();
              });
            this.loading.dismiss();
          } else {
            this.dismiss();
            this.signOut();
            this.showAlert('Verifikation Fehlgeschlagen', 'Bitte geben Sie nur ihre Daten zur Verifikation ein. Sie werden ausgeloggt.');
          }
        });
      }
    }).catch((err) => {
      this.showAlert('Verifikation Fehlgeschlagen', 'Das Passwort wurde falsch eingegeben, versuchen Sie es erneuert.');
      console.log(err);
    });
    await this.profileService.unsubscribeGetProfileSubscription();
  }

  private signOut() {
    this.authService.logout();
  }

  // close Modal View
  protected dismiss() {
    this.viewCtrl.dismiss();
  }

}
