import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { BasePage } from '../../base/base';

/**
 * This class represents the Profile Email Modal Page.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  selector: 'page-profile-email-modal',
  templateUrl: './profile-email-modal.html',
  providers: [AuthService, ProfileService]
})
export class ProfileEmailModalPage extends BasePage {

  protected profileEmailModalForm: FormGroup;

  /**
   * The Constructor of Profile Email Modal Page.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {ViewController} viewCtrl The ViewController, for this Modal Page
   * @param {FormBuilder} formBuilder The Form Builder for Form Validation
   * @param {AuthService} authService The Auth Service, provides Methods for the authenticated User
   * @param {ProfileService} profileService The Profile Service, provides Methods for Profiles
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              protected viewCtrl: ViewController,
              protected formBuilder: FormBuilder,
              private authService: AuthService,
              private profileService: ProfileService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  /**
   * Loads the Form Validation.
   */
  ngOnInit() {
    this.createLoading('Änderungen werden vorgenommen...');
    this.initForm();
  }

  /**
   * Initialize the Form Validation.
   */
  protected initForm() {
    this.profileEmailModalForm = this.formBuilder.group({
      currentEmail: ['', [Validators.required, Validators.pattern(ProfileEmailModalPage.REGEX_EMAIL)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.pattern(ProfileEmailModalPage.REGEX_EMAIL)]]
    });
  }

  /**
   * Set new Profile Email.
   *
   * @returns {Promise<void>}
   */
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
        if (email === this.profileEmailModalForm.value.email) {
          this.showAlert('E Mail', 'Die eingegebene E Mail Adresse stimmt mit der Derzeitigen überein. Bitte geben Sie eine andere E Mail Adresse ein.');
        } else {
          await this.authService.login(this.profileEmailModalForm.value.currentEmail, this.profileEmailModalForm.value.password).then(async () => {
            // get Auth Uid
            const authUid = this.authService.getAuthUid();

            // Update Auth Email
            await this.authService.updateAuthEmail(this.profileEmailModalForm.value.email);

            this.loading.present();

            // set Profile Email
            await this.profileService.setProfileEmail(authUid, this.profileEmailModalForm.value.email)
              .then(() => {
                this.dismiss();
              });
            this.loading.dismiss();
          });
        }
      }
    }).catch((err) => {
      this.showAlert('Verifikation Fehlgeschlagen', 'Das Passwort wurde falsch eingegeben oder die gewünschte E Mail Adresse ist schon vorhanden, versuchen Sie es erneuert.');
      console.log(err);
    });
    await this.profileService.unsubscribeGetProfileSubscription();
  }

  /**
   * Close Modal View.
   */
  protected dismiss() {
    this.viewCtrl.dismiss();
  }

}
