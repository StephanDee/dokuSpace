import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { BasePage } from '../../base/base';
import { CourseService } from '../../../services/course.service';

/**
 * This class represents the Profile Name Modal Page.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  selector: 'page-profilename-modal',
  templateUrl: './profile-name-modal.html',
  providers: [AuthService, ProfileService, CourseService]
})
export class ProfileNameModalPage extends BasePage {

  protected profileNameModalForm: FormGroup;

  /**
   * The Constructor of Profile Name Modal Page.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {ViewController} viewCtrl The View Controller, used for this Modal
   * @param {FormBuilder} formBuilder The Form Builder for Form Validation
   * @param {AuthService} authService The Auth Service, provides Methods for the authenticated User
   * @param {ProfileService} profileService The Profile Service, provides Methods for Profiles
   * @param {CourseService} courseService The Course Service, provides Methods for Courses
   */
  constructor(protected navCtrl: NavController,
              protected alertCtrl: AlertController,
              protected loadingCtrl: LoadingController,
              protected viewCtrl: ViewController,
              protected formBuilder: FormBuilder,
              private authService: AuthService,
              private profileService: ProfileService,
              private courseService: CourseService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  /**
   * Loads the Form Validation.
   */
  ngOnInit() {
    this.createLoading('Änderungen werden vorgenommen...');
    this.initForm();
  }

  /**
   * Initialize the Form Validation.
   */
  protected initForm() {
    this.profileNameModalForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(25), Validators.pattern(ProfileNameModalPage.REGEX_START_NOBLANK)]]
    });
  }

  /**
   * Set New Profile Name.
   *
   * @returns {Promise<void>}
   */
  protected async setNewProfileName() {
    if (this.profileNameModalForm.invalid) {
      this.showAlert('Profil', 'Bitte Formularfelder richtig ausfüllen.');
    }
    this.loading.present();
    // get Auth Uid
    const authUid = this.authService.getAuthUid();

    // set profile name
    await this.profileService.setProfileName(authUid, this.profileNameModalForm.value.name)
      .then(() => {
        this.dismiss();
      }).catch((err) => {
        this.showAlert('Profil', 'Ein Fehler ist aufgetreten. ' + err.code + '_:' + err.message);
        console.error(err);
      });

    // update creatorName for its courses, if user set a new Profile Name
    await this.courseService.getCoursesSubscription().then(async (data) => {
      for (let ids of data) {
        const courseId = ids.courseId;
        const creatorUid = ids.creatorUid;

        if (authUid === creatorUid) {
          this.courseService.setCourseCreatorName(courseId, this.profileNameModalForm.value.name);
        }
      }
      await this.courseService.unsubscribeGetCoursesSubscription();
    }).catch((err) => {
      alert('Ein Fehler ist aufgetreten. ' + err.code + '_:' + err.message);
      console.log(err);
    });
    this.loading.dismiss();
  }

  /**
   * Close Modal View
   */
  protected dismiss() {
    this.viewCtrl.dismiss();
  }

}
