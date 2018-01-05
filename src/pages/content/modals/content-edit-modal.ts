import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from '../../../services/file.service';
import { ContentService } from '../../../services/content.service';
import { Content } from '../../../models/content';
import { BasePage } from '../../base/base';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';

/**
 * This class represents the Course Create Modal Page.
 */
@Component({
  selector: 'page-content-edit-modal',
  templateUrl: './content-edit-modal.html',
  providers: [ContentService, FileService]
})
export class ContentEditModalPage extends BasePage {

  protected courseId: string;
  protected contentId: string;
  protected contentEditModalForm: FormGroup;
  protected contentData: FirebaseObjectObservable<Content>;

  /**
   *
   * @param {NavController} navCtrl
   * @param {AlertController} alertCtrl
   * @param {LoadingController} loadingCtrl
   * @param {ViewController} viewCtrl
   * @param {NavParams} navParams
   * @param {FormBuilder} formBuilder
   * @param {ContentService} contentService
   * @param {FileService} fileService
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public viewCtrl: ViewController,
              protected navParams: NavParams,
              protected formBuilder: FormBuilder,
              private contentService: ContentService,
              private fileService: FileService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  async ngOnInit() {
    this.createLoading('Content wird bearbeitet...');
    this.courseId = this.navParams.get('courseId');
    this.contentId = this.navParams.get('contentId');
    this.contentData = this.contentService.getContent(this.courseId, this.contentId);

    this.initForm();
  }

  /**
   * Initialize the form.
   */
  protected initForm() {
    this.contentEditModalForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(25), Validators.pattern(ContentEditModalPage.REGEX_START_NOBLANK)]],
      description: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(ContentEditModalPage.REGEX_START_NOBLANK)]]
    });
  }

  protected editContentTitleAndDescription() {
    this.contentService.updateContentTitleAndDescription(this.courseId, this.contentId, this.contentEditModalForm.value.title, this.contentEditModalForm.value.description);
    this.dismiss();
  }

  protected chooseAndUploadNewVideo() {
    this.fileService.chooseAndUploadContentVideo(this.courseId, this.contentId, null, null);
  }

  // close Modal View
  protected dismiss() {
    this.viewCtrl.dismiss();
  }

}
