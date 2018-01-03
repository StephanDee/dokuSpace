import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { BasePage } from '../../base/base';
import { CourseService } from '../../../services/course.service';

/**
 * This class represents the login-page.
 */
@Component({
  selector: 'page-profilename-modal',
  templateUrl: './profile-name-modal.html',
  providers: [AuthService, ProfileService, CourseService]
})
export class ProfileNameModalPage extends BasePage {

  protected profileNameModalForm: FormGroup;

  /**
   *
   * @param {NavController} navCtrl
   * @param {AlertController} alertCtrl
   * @param {LoadingController} loadingCtrl
   * @param {ViewController} viewCtrl
   * @param {FormBuilder} formBuilder
   * @param {AuthService} authService
   * @param {ProfileService} profileService
   * @param {CourseService} courseService
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public viewCtrl: ViewController,
              protected formBuilder: FormBuilder,
              private authService: AuthService,
              private profileService: ProfileService,
              private courseService: CourseService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  async ngOnInit() {
    this.createLoading('Änderungen werden vorgenommen...');
    this.initForm();
  }

  /**
   * Initialize the form.
   */
  protected initForm() {
    this.profileNameModalForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(20), Validators.pattern(ProfileNameModalPage.REGEX_NAME)]]
    });
  }

  protected async setNewProfileName() {
    if (this.profileNameModalForm.invalid) {
      this.showAlert('Profil', 'Bitte Formularfelder richtig ausfüllen.');
    }
    this.loading.present();
    // get Auth Uid
    const authUid = this.authService.getAuthUid();

    await this.profileService.getProfileSubscription(authUid).then(async (data) => {
      const currentProfileName = data.name;

      // update creatorName for courses, when user set a new Profile Name
      await this.courseService.getCoursesSubscription().then(async (data) => {
        for (let ids of data) {
          const courseId = ids.courseId;
          const creatorName = ids.creatorName;
          if (creatorName === currentProfileName) {
            this.courseService.setCourseName(courseId, this.profileNameModalForm.value.name);
          }
        }
        await this.courseService.unsubscribeGetCoursesSubscription();
      });

    }).catch((err) => {
      alert('Ein Fehler ist aufgetreten: ' + err);
      console.log(err);
    });

    // set profile name
    await this.profileService.setProfileName(authUid, this.profileNameModalForm.value.name)
      .then(() => {
        this.dismiss();
      }).catch((err) => {
        this.showAlert('Profil', 'Ein Fehler ist aufgetreten.');
        console.error(err);
      });
    this.loading.dismiss();
  }

  // Close Modal View
  protected dismiss() {
    this.viewCtrl.dismiss();
  }

}
