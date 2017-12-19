import { Component } from '@angular/core';
import { BasePage } from '../base/base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * This class represents the signup-page.
 */
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignUpPage extends BasePage {

  protected signUpForm: FormGroup;

  /**
   *
   * @param {NavController} navCtrl
   * @param {FormBuilder} formBuilder
   * @param {AngularFireAuth} afAuth
   * @param {ToastController} toastCtrl
   */
  constructor(public navCtrl: NavController,
              protected formBuilder: FormBuilder,
              private afAuth: AngularFireAuth,
              private toastCtrl: ToastController) {
    super(navCtrl);
  }

  async ngOnInit() {
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
      console.log('Bitte geben Sie ihre Daten in der richtigen Form ein.');
    }
    await this.afAuth.auth.createUserWithEmailAndPassword(this.signUpForm.get('email').value,
      this.signUpForm.get('password').value).then((user) => {
      console.log(user);
      // this.goToRootPage();
      this.signUpSuccessToast();
    }).catch((err) => {
      console.error(err);
    });
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
