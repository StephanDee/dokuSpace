import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ContentFileService } from '../../../services/content.file.service';
import { ContentService } from '../../../services/content.service';
import { BasePage } from '../../base/base'

/**
 * This class represents the Course Create Modal Page.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  selector: 'page-content-create-modal',
  templateUrl: './content-create-modal.html',
  providers: [AuthService, ContentService, ContentFileService]
})
export class ContentCreateModalPage extends BasePage {

  protected courseId: string;
  protected contentCreateModalForm: FormGroup;

  /**
   * The Constructor of the Content Create Modal Page.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {ViewController} viewCtrl The View Controller, for this Modal Page
   * @param {NavParams} navParams The Navigation Controller, provides Parameter from other Pages
   * @param {FormBuilder} formBuilder, The Form Builder, used to create validation
   * @param {ContentService} contentService The Content Service, provides Methods for Contents
   * @param {ContentFileService} contentFileService The Content File Service, provides Methods for Content Files
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              protected viewCtrl: ViewController,
              protected navParams: NavParams,
              protected formBuilder: FormBuilder,
              private contentService: ContentService,
              private contentFileService: ContentFileService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  /**
   * Loads Parameter from the previous Page.
   * Loads the Form Validation.
   */
  ngOnInit() {
    this.createLoading('Content wird erstellt...');
    this.courseId = this.navParams.get('courseId');

    this.initForm();
  }

  /**
   * Initialize the Form Validation.
   */
  protected initForm() {
    this.contentCreateModalForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(25), Validators.pattern(ContentCreateModalPage.REGEX_START_NOBLANK)]],
      description: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(ContentCreateModalPage.REGEX_START_NOBLANK)]]
    });
  }

  /**
   * Creates a new Content and leaves the Modal Page.
   *
   * @constructor
   */
  protected CreateNewContent() {
    if (this.contentCreateModalForm.invalid) {
      this.showAlert('Content', 'Bitte Formularfelder richtig ausfüllen.');
    }

    this.loading.present();

    const contentId = this.contentService.createContentId();

    // Choose Title Image and create Course
    this.contentFileService.chooseAndUploadContentVideo(this.courseId,
      contentId,
      this.contentCreateModalForm.value.title,
      this.contentCreateModalForm.value.description).then(() => {
      this.dismiss();
    });

    this.loading.dismiss();
    this.dismiss();
  }

  /**
   * close Modal View
   */
  protected dismiss() {
    this.viewCtrl.dismiss();
  }

}
