import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { FileService } from '../../../services/file.service';
import { BasePage } from '../../base/base';
import { Course } from '../../../models/course';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';

/**
 * This class represents the Course Create Modal Page.
 */
@Component({
  selector: 'page-course-edit-modal',
  templateUrl: './course-edit-modal.html',
  providers: [CourseService, FileService]
})
export class CourseEditModalPage extends BasePage {

  protected courseId: string;
  protected courseEditModalForm: FormGroup;
  protected courseData: FirebaseObjectObservable<Course>;

  /**
   *
   * @param {NavController} navCtrl
   * @param {AlertController} alertCtrl
   * @param {LoadingController} loadingCtrl
   * @param {ViewController} viewCtrl
   * @param {NavParams} navParams
   * @param {FormBuilder} formBuilder
   * @param {CourseService} courseService
   * @param {FileService} fileService
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public viewCtrl: ViewController,
              protected navParams: NavParams,
              protected formBuilder: FormBuilder,
              private courseService: CourseService,
              private fileService: FileService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  async ngOnInit() {
    this.createLoading('Kurs wird erstellt...');
    this.courseId = this.navParams.get('courseId');
    this.courseData = this.courseService.getCourse(this.courseId);

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

  protected editCourseTitleAndDescription() {
    this.courseService.updateCourseTitleAndDescription(this.courseId, this.courseEditModalForm.value.title, this.courseEditModalForm.value.description);
    this.dismiss();
  }

  protected chooseAndUploadNewTitleImage() {
    this.fileService.chooseAndUploadCourseTitleImage(this.courseId, null, null, null, null, null);
  }

  // close Modal View
  protected dismiss() {
    this.viewCtrl.dismiss();
  }

}
