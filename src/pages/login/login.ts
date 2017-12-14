import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUpPage } from '../signup/signup';
// import { TabsPage } from '../tabs/tabs';
import { ProfileCreatePage } from '../profile/profile-create';
import { BasePage } from '../base/base';
import { AngularFireAuth } from 'angularfire2/auth';

/**
 * This class represents the login-page.
 */
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage extends BasePage {

  protected loginForm: FormGroup;

  /**
   *
   * @param {NavController} navCtrl
   * @param {FormBuilder} formBuilder
   * @param {AngularFireAuth} afAuth
   */
  constructor(public navCtrl: NavController,
              protected formBuilder: FormBuilder,
              private afAuth: AngularFireAuth) {
    super(navCtrl);
  }

  async ngOnInit() {
    this.initForm();
  }

  /**
   * Initialize the form.
   */
  protected initForm() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.pattern(LoginPage.REGEX_EMAIL)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  protected async login() {
    if (this.loginForm.invalid) {
      console.log('Anmeldung fehlgeschlagen, Das Passwort ist falsch oder der Nutzer existiert nicht.');
    } else {
      await this.afAuth.auth.signInWithEmailAndPassword(this.loginForm.get('email').value, this.loginForm.get('password').value).then(user => {
          if (user) {
            this.navCtrl.push(ProfileCreatePage);
          } else {
            console.log('Ein Fehler ist aufgetreten.');
          }
        }).catch((err) => {
          console.error(err);
        });
    }
  }

  protected openSignUpPage() {
    this.navCtrl.push(SignUpPage);
  }

}
