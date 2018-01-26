import { Component } from '@angular/core';
import { BasePage } from '../base/base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController, ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

/**
 * This class represents the Sign Up Page.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [AuthService]
})
export class SignUpPage extends BasePage {

  // Attributes
  protected signUpForm: FormGroup;

  /**
   * The Constructor of Sign Up Page.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {ToastController} toastCtrl The Toast Controller
   * @param {FormBuilder} formBuilder The Form Builder, for Form Validation
   * @param {AuthService} authService The Auth Controller, provides Methods for the authenticated User
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              protected formBuilder: FormBuilder,
              private authService: AuthService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  /**
   * Loads the Form Validation.
   */
  ngOnInit() {
    this.createLoading('Profil wird erstellt...');
    this.initForm();
  }

  /**
   * Initialize the Form Validation.
   */
  protected initForm() {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(SignUpPage.REGEX_EMAIL)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Sign Up.
   *
   * @returns {Promise<void>}
   */
  protected async signUp() {
    if (this.signUpForm.invalid) {
      this.showAlert('Registrieren', 'Bitte Formularfelder richtig ausfüllen.');
    } else {
      await this.authService.register(this.signUpForm.get('email').value, this.signUpForm.get('password').value)
        .then(() => {
          this.loading.present();
          this.signUpSuccessToast();
        }).catch((err) => {
          this.loading.dismiss();
          this.showAlert('Registrieren', 'Ein Nutzer mit dieser E Mail Adresse ist bereits registriert.');
          console.error(err);
        });
      this.loading.dismiss();
    }
  }

  /**
   * Success Toast, Profile was successfully created.
   */
  protected signUpSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Profil wurde erfolgreich erstellt.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

}
