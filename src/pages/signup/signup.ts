import { Component } from '@angular/core';
import { BasePage } from '../base/base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController, NavController, ToastController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';

/**
 * This class represents the signup-page.
 */
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html',
  providers: [AuthService]
})
export class SignUpPage extends BasePage {

  protected signUpForm: FormGroup;

  /**
   *
   * @param {NavController} navCtrl
   * @param {AlertController} alertCtrl
   * @param {LoadingController} loadingCtrl
   * @param {FormBuilder} formBuilder
   * @param {AuthService} authService
   * @param {ToastController} toastCtrl
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              protected formBuilder: FormBuilder,
              private authService: AuthService,
              private toastCtrl: ToastController) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  async ngOnInit() {
    this.createLoading('Profil wird erstellt...');
    this.initForm();
  }

  /**
   * Initialize the form.
   */
  protected initForm() {
    this.signUpForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(SignUpPage.REGEX_EMAIL)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

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
          this.showAlert('Registrieren', 'Ein Fehler ist aufgetreten.');
          console.error(err);
        });
      this.loading.dismiss();
    }
  }

  protected signUpSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Profil wurde erfolgreich erstellt.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

}
