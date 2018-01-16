import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ProfileService } from '../../../services/profile.service';
import { CourseService } from '../../../services/course.service';
import { FileService } from '../../../services/file.service';
import { BasePage } from '../../base/base';

/**
 * This class represents the Course Create Modal Page.
 */
@Component({
  selector: 'page-course-create-modal',
  templateUrl: './course-create-modal.html',
  providers: [AuthService, ProfileService, CourseService, FileService]
})
export class CourseCreateModalPage extends BasePage {

  protected courseCreateModalForm: FormGroup;

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
   * @param {FileService} fileService
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public viewCtrl: ViewController,
              protected formBuilder: FormBuilder,
              private authService: AuthService,
              private profileService: ProfileService,
              private courseService: CourseService,
              private fileService: FileService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  async ngOnInit() {
    this.createLoading('Kurs wird erstellt...');
    this.initForm();
  }

  /**
   * Initialize the form.
   */
  protected initForm() {
    this.courseCreateModalForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(25), Validators.pattern(CourseCreateModalPage.REGEX_START_NOBLANK)]],
      description: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(CourseCreateModalPage.REGEX_START_NOBLANK)]]
    });
  }

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
      await this.fileService.chooseAndUploadCourseTitleImage(courseId,
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

  // close Modal View
  protected dismiss() {
    this.viewCtrl.dismiss();
  }

}
