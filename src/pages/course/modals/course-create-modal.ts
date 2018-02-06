import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { CourseService } from '../../../services/course.service';
import { CourseFileService } from '../../../services/course.file.service';
import { BasePage } from '../../base/base';

/**
 * This class represents the Course Create Modal Page.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  selector: 'page-course-create-modal',
  templateUrl: './course-create-modal.html',
  providers: [AuthService, ProfileService, CourseService, CourseFileService]
})
export class CourseCreateModalPage extends BasePage {

  // Attributes
  protected courseCreateModalForm: FormGroup;

  /**
   * The Constructor of CourseCreateModalPage.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {ViewController} viewCtrl The ViewController, for this Modal Page
   * @param {FormBuilder} formBuilder The Form Builder, used for validation
   * @param {AuthService} authService The Auth Service, provides Methods for the authenticated User
   * @param {ProfileService} profileService The Profile Service, provides Methods for Profiles
   * @param {CourseService} courseService The Course Service, provides Methods for Courses
   * @param {CourseFileService} courseFileService The Course File Service, provides Methods for Course Files
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              protected viewCtrl: ViewController,
              protected formBuilder: FormBuilder,
              private authService: AuthService,
              private profileService: ProfileService,
              private courseService: CourseService,
              private courseFileService: CourseFileService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  /**
   * Loads the Form Validation.
   */
  ngOnInit() {
    this.createLoading('Kurs wird erstellt...');
    this.initForm();
  }

  /**
   * Initialize the Form Validation.
   */
  protected initForm() {
    this.courseCreateModalForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(25), Validators.pattern(CourseCreateModalPage.REGEX_START_NOBLANK)]],
      description: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(CourseCreateModalPage.REGEX_START_NOBLANK)]]
    });
  }

  /**
   * Creates a New Course.
   *
   * @constructor
   */
  protected CreateNewCourse() {
    if (this.courseCreateModalForm.invalid) {
      this.showAlert('Kurs', 'Bitte Formularfelder richtig ausfüllen.');
    }

    this.loading.present();

    // get Auth Uid
    const authUid = this.authService.getAuthUid();
    const courseId = this.courseService.createCourseId();

    // get Profile Data
    this.profileService.getProfileSubscription(authUid).then(async (data) => {
      let name = data.name;
      let photoURL = data.photoURL;
      let thumbPhotoURL = data.thumbPhotoURL;

      // Choose Title Image and create Course
      await this.courseFileService.chooseAndUploadCourseTitleImage(courseId,
        this.courseCreateModalForm.value.title,
        this.courseCreateModalForm.value.description,
        name,
        authUid,
        photoURL,
        thumbPhotoURL).then(() => {
        this.dismiss();
      });
    }).catch((err) => {
      this.loading.dismiss();
      this.dismiss();
      console.log(err);
    });
    this.loading.dismiss();
    this.profileService.unsubscribeGetProfileSubscription();
  }

  /**
   * Close Modal View
   */
  protected dismiss() {
    this.viewCtrl.dismiss();
  }

}
