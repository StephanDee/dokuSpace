import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ContentFileService } from '../../../services/content.file.service';
import { ContentService } from '../../../services/content.service';
import { Content } from '../../../models/content';
import { BasePage } from '../../base/base';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';

/**
 * This class represents the Course Edit Modal Page.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  selector: 'page-content-edit-modal',
  templateUrl: './content-edit-modal.html',
  providers: [AuthService, ContentService, ContentFileService]
})
export class ContentEditModalPage extends BasePage {

  // Attributes
  protected courseId: string;
  protected contentId: string;
  protected contentEditModalForm: FormGroup;
  protected contentData: FirebaseObjectObservable<Content>;

  /**
   * The Constructor of the Content Edit Modal Page.
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
  constructor(protected navCtrl: NavController,
              protected alertCtrl: AlertController,
              protected loadingCtrl: LoadingController,
              protected viewCtrl: ViewController,
              protected navParams: NavParams,
              protected formBuilder: FormBuilder,
              private contentService: ContentService,
              private contentFileService: ContentFileService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  /**
   * Loads Parameter from the previous Page and Contents to display on the HTML.
   * Loads the Form Validation.
   */
  ngOnInit() {
    this.createLoading('Content wird bearbeitet...');
    this.courseId = this.navParams.get('courseId');
    this.contentId = this.navParams.get('contentId');
    this.contentData = this.contentService.getContent(this.courseId, this.contentId);

    this.initForm();
  }

  /**
   * Initialize the Form Validation.
   */
  protected initForm() {
    this.contentEditModalForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(25), Validators.pattern(ContentEditModalPage.REGEX_START_NOBLANK)]],
      description: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(ContentEditModalPage.REGEX_START_NOBLANK)]]
    });
  }

  /**
   * Edit Title and Description.
   */
  protected editContentTitleAndDescription() {
    this.contentService.updateContentTitleAndDescription(this.courseId, this.contentId, this.contentEditModalForm.value.title, this.contentEditModalForm.value.description);
    this.dismiss();
  }

  /**
   * Choose and Upload new Video.
   */
  protected chooseAndUploadNewVideo() {
    this.contentFileService.chooseAndUploadContentVideo(this.courseId, this.contentId, null, null);
  }

  /**
   * close Mdal View
   */
  protected dismiss() {
    this.viewCtrl.dismiss();
  }

}
