import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { SignUpPage } from '../signup/signup';
import { BasePage } from '../base/base';

/**
 * This class represents the Login Page.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
  providers: [AuthService]
})
export class LoginPage extends BasePage {

  protected loginForm: FormGroup;

  /**
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {FormBuilder} formBuilder The Form Builder, for Form Validation
   * @param {AuthService} authService The Auth Service, provides Methods for the authenticated User
   */
  constructor(protected navCtrl: NavController,
              protected alertCtrl: AlertController,
              protected loadingCtrl: LoadingController,
              protected formBuilder: FormBuilder,
              private authService: AuthService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  /**
   * Loads The Form Validation.
   */
  ngOnInit() {
    this.createLoading('Authentifizierung...');
    this.initForm();
  }

  /**
   * Initialize the Form Validation.
   */
  protected initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(LoginPage.REGEX_EMAIL)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * User Login.
   *
   * @returns {Promise<void>}
   */
  protected async userSignIn() {
    if (this.loginForm.invalid) {
      this.showAlert('Login', 'Bitte Formularfelder richtig ausfüllen.');
    } else {
      await this.authService.login(this.loginForm.get('email').value, this.loginForm.get('password').value).then((user) => {
        this.loading.present();
        if (user) {
          // this.navCtrl.setRoot(TabsPage);
        } else {
          this.showAlert('Anmeldung fehlgeschlagen', 'Ein Fehler ist aufgetreten.');
        }
      }).catch((err) => {
        this.loading.dismiss();
        this.showAlert('Anmeldung fehlgeschlagen', 'Das Passwort ist falsch oder der Nutzer existiert nicht.');
        console.error(err);
      });
      this.loading.dismiss();
    }
  }

  /**
   * Open Sign Up Page.
   */
  protected openSignUpPage() {
    this.navCtrl.push(SignUpPage);
  }

  /**
   * Open Forget Password Dialog.
   */
  protected openForgotPasswordDialog() {
    this.showAlert('Passwort vergessen?', 'Überprüfen Sie ihre Eingabe auf Korrektheit.');
  }

}
