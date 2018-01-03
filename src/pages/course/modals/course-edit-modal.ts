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
  selector: 'page-course-edit-modal',
  templateUrl: './course-edit-modal.html',
  providers: [AuthService, ProfileService, CourseService, FileService]
})
export class CourseEditModalPage extends BasePage {

  protected courseEditModalForm: FormGroup;

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
    this.courseEditModalForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(20), Validators.pattern(CourseEditModalPage.REGEX_START_NOBLANK)]],
      description: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(CourseEditModalPage.REGEX_START_NOBLANK)]]
    });
  }

  protected editCourse() {
    // if (this.courseEditModalForm.invalid) {
    //   this.showAlert('Kurs', 'Bitte Formularfelder richtig ausfüllen.');
    // }
    //
    // this.loading.present();
    //
    // // get Auth Uid
    // const authUid = this.authService.getAuthUid();
    // const courseId = this.courseService.getCourseId();
    //
    // // get Profile Data
    // this.profileService.getProfileSubscription(authUid).then(async (data) => {
    //   let name = data.name;
    //   let photoURL = data.photoURL;
    //
    //   // Choose Title Image and create Course
    //   await this.fileService.chooseAndUploadCourseTitleImage(courseId,
    //     this.courseEditModalForm.value.title,
    //     this.courseEditModalForm.value.description,
    //     name,
    //     authUid,
    //     photoURL).then(() => {
    //     this.dismiss();
    //   });
    // }).catch((err) => {
    //   this.loading.dismiss();
    //   this.dismiss();
    //   console.log(err);
    // });
    // this.loading.dismiss();
    // this.profileService.unsubscribeGetProfileSubscription();
  }

  // close Modal View
  protected dismiss() {
    this.viewCtrl.dismiss();
  }

}
