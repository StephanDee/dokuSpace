import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CourseService } from '../../../services/course.service';
import { BasePage } from '../../base/base';
import { Course } from '../../../models/course';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { AuthService } from '../../../services/auth.service';
import { CourseFileService } from '../../../services/course.file.service';

/**
 * This class represents the Course Create Modal Page.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  selector: 'page-course-edit-modal',
  templateUrl: './course-edit-modal.html',
  providers: [AuthService, CourseService, CourseFileService]
})
export class CourseEditModalPage extends BasePage {

  // Attributes
  protected courseId: string;
  protected courseEditModalForm: FormGroup;
  protected courseData: FirebaseObjectObservable<Course>;

  /**
   * The Constructor of the Course Edit Modal Page.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {ViewController} viewCtrl The View Controller, used for this Modal Page
   * @param {NavParams} navParams The Navigation Parameter, from the previous Page
   * @param {FormBuilder} formBuilder The Form Builder, for Form Validation
   * @param {CourseService} courseService The Course Service, provides Methods for Courses
   * @param {CourseFileService} courseFileService The Course File Service, provides Methods for Course Files
   */
  constructor(protected navCtrl: NavController,
              protected alertCtrl: AlertController,
              protected loadingCtrl: LoadingController,
              protected viewCtrl: ViewController,
              protected navParams: NavParams,
              protected formBuilder: FormBuilder,
              private courseService: CourseService,
              private courseFileService: CourseFileService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  /**
   * Loads the Parameter from previous Page and Course, to display on the HTML.
   * Loads the Form Validation.
   */
  ngOnInit() {
    this.createLoading('Kurs wird erstellt...');
    this.courseId = this.navParams.get('courseId');
    this.courseData = this.courseService.getCourse(this.courseId);

    this.initForm();
  }

  /**
   * Initialize the Form Validation.
   */
  protected initForm() {
    this.courseEditModalForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(25), Validators.pattern(CourseEditModalPage.REGEX_START_NOBLANK)]],
      description: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(CourseEditModalPage.REGEX_START_NOBLANK)]]
    });
  }

  /**
   * Edit Course Title And Description.
   */
  protected editCourseTitleAndDescription() {
    this.courseService.updateCourseTitleAndDescription(this.courseId, this.courseEditModalForm.value.title, this.courseEditModalForm.value.description);
    this.dismiss();
  }

  /**
   * Choose and Upload new Title Image.
   */
  protected chooseAndUploadNewTitleImage() {
    this.courseFileService.chooseAndUploadCourseTitleImage(this.courseId, null, null, null, null, null, null);
    this.dismiss();
  }

  /**
   * Close Modal View.
   */
  protected dismiss() {
    this.viewCtrl.dismiss();
  }

}
