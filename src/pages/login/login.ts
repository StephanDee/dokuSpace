import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SignUpPage } from '../signup/signup';
import { BasePage } from '../base/base';
import { AngularFireAuth } from 'angularfire2/auth';
import { TabsPage } from '../tabs/tabs';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { ProfileCreatePage } from "../profile/profile-create";

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
   * @param {AngularFireDatabase} afDb
   */
  constructor(public navCtrl: NavController,
              protected formBuilder: FormBuilder,
              private afAuth: AngularFireAuth,
              private afDb: AngularFireDatabase) {
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
      console.log('Bitte Formularfelder richtig ausfüllen.');
    } else {
      try {
        const user = await this.afAuth.auth.signInWithEmailAndPassword(this.loginForm.get('email').value, this.loginForm.get('password').value);
        if (user) {
          console.log('userid: ', user.uid);
          // TODO: Check if Profile already made or go to ProfileCreatePage
          if (user.uid) {
            this.navCtrl.setRoot(ProfileCreatePage);
          } else {
            this.navCtrl.setRoot(TabsPage);
            console.log(user);
          }
        }
        else {
          console.log('Anmeldung fehlgeschlagen, Das Passwort ist falsch oder der Nutzer existiert nicht.');
        }
      } catch (err) {
        console.error(err);
      }
    }
  }

  protected openSignUpPage() {
    this.navCtrl.push(SignUpPage);
  }

}
