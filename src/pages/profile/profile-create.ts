import { Component } from '@angular/core';
import { BasePage } from '../base/base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Subscription } from 'rxjs/Subscription';
import { Profile } from '../../models/profile';
import { TabsPage } from "../tabs/tabs";


/**
 * This class represents the profile-create-page.
 */
@Component({
  selector: 'page-profile-create',
  templateUrl: 'profile-create.html'
})
export class ProfileCreatePage extends BasePage {

  protected userAuthSubscription: Subscription;
  protected profileForm: FormGroup;

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
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  protected unsubscribeUserAuthSubscription() {
    this.userAuthSubscription.unsubscribe();
  }

  protected createProfile() {
    if (this.profileForm.invalid) {
      console.log('Bitte geben Sie ihre Daten in der richtigen Form ein.');
    }
    this.userAuthSubscription = this.afAuth.authState.subscribe(auth => {
      const profile = new Profile();
      profile.name = this.profileForm.value.name;
      profile.email = auth.email;
      profile.emailVerified = auth.emailVerified;
      profile.role = Profile.ROLE_STUDENT;
      profile.photoURL = Profile.DEFAULT_PHOTOURL;

      // object to have only one version of the profile
      this.afDb.object(`/profiles/${auth.uid}`).set(profile)
        .then(() => {
          this.unsubscribeUserAuthSubscription();
          this.navCtrl.setRoot(TabsPage);
        }).catch((err) =>
        console.error(err));
    });
  }

}
