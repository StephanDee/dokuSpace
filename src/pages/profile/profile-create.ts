import { Component } from '@angular/core';
import { BasePage } from '../base/base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';

/**
 * This class represents the Profile Create Page.
 * Will be displayed, if a new Profile was created.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  selector: 'page-profile-create',
  templateUrl: 'profile-create.html',
  providers: [AuthService, ProfileService]
})
export class ProfileCreatePage extends BasePage {

  // Attributes
  protected profileForm: FormGroup;

  /**
   * The Constructor of Profile Create Page.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {FormBuilder} formBuilder The Form Builder for Form Validation
   * @param {AuthService} authService The Auth Service, provides Methods for authenticated Users
   * @param {ProfileService} profileService The Profile Service, provides Methods for Profiles
   */
  constructor(protected navCtrl: NavController,
              protected alertCtrl: AlertController,
              protected loadingCtrl: LoadingController,
              protected formBuilder: FormBuilder,
              private authService: AuthService,
              private profileService: ProfileService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  /**
   * Loads the Form Validation.
   */
  ngOnInit() {
    this.createLoading('Daten werden synchronisiert...');
    this.initForm();
  }

  /**
   * Initialize the Form Validation.
   */
  protected initForm() {
    this.profileForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(25), Validators.pattern(ProfileCreatePage.REGEX_START_NOBLANK)]]
    });
  }

  /**
   * Creates extra Profile Inputs.
   */
  protected createExtraProfileInputs() {
    if (this.profileForm.invalid) {
      this.showAlert('Profil', 'Bitte Formularfelder richtig ausfüllen.');
    }
    this.loading.present();
    // get Auth Uid
    const authUid = this.authService.getAuthUid();

    // set profile name
    this.profileService.setProfileName(authUid, this.profileForm.value.name)
      .then(() => {
        this.navCtrl.setRoot(TabsPage);
      }).catch((err) => {
      this.authService.logout();
      this.showAlert('Profil erstellen', 'Ein Fehler ist aufgetreten oder Sie haben keine Befugnis. Sie wurden ausgeloggt.');
      console.error(err);
    });
    this.loading.dismiss();
  }

}
