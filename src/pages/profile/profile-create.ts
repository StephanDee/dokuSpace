import { Component } from '@angular/core';
import { BasePage } from '../base/base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from 'ionic-angular';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Profile } from '../../models/profile';
import { Subscription } from 'rxjs/Subscription';
import { ProfileTabPage } from "./profile-tab";


/**
 * This class represents the profile-create-page.
 */
@Component({
  selector: 'page-profile-create',
  templateUrl: 'profile-create.html'
})
export class ProfileCreatePage extends BasePage {

  protected userAuthSubcription: Subscription;
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

  // public getUserProfileName() {
  //   this.afAuth.authState.subscribe(data => {
  //     if (data && data.email && data.uid) {
  //       this.afDb.object(`profiles/${data.uid}`).subscribe(user => {
  //         console.log(user.name);
  //         if (user.name !== undefined) {
  //           this.navCtrl.setRoot(TabsPage);
  //         }
  //       });
  //     }
  //   });
  // }

  /**
   * Initialize the form.
   */
  protected initForm() {
    this.profileForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  protected unsubscribeUserAuthSubcription() {
    this.userAuthSubcription.unsubscribe();
  }

  protected createProfile() {
    if (this.profileForm.invalid) {
      console.log('Bitte geben Sie ihre Daten in der richtigen Form ein.');
    }
    try {
      this.userAuthSubcription = this.afAuth.authState.take(1).subscribe(auth => {
        const profile = new Profile();
        profile.name = this.profileForm.value.name;

        // object to have only one version of the profile
        this.afDb.object(`/profiles/${auth.uid}`).set(profile)
          .then(() =>
            this.navCtrl.setRoot(ProfileTabPage));
        this.unsubscribeUserAuthSubcription();
      });
    } catch (err) {
      console.error(err);
    }
  }

}
