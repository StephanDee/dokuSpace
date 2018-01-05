import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileService } from '../../../services/file.service';
import { ContentService } from '../../../services/content.service';
import { BasePage } from '../../base/base'

/**
 * This class represents the Course Create Modal Page.
 */
@Component({
  selector: 'page-content-create-modal',
  templateUrl: './content-create-modal.html',
  providers: [ContentService, FileService]
})
export class ContentCreateModalPage extends BasePage {

  protected courseId: string;
  protected contentCreateModalForm: FormGroup;

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
    this.createLoading('Content wird erstellt...');
    this.courseId = this.navParams.get('courseId');
    this.initForm();
  }

  /**
   * Initialize the form.
   */
  protected initForm() {
    this.contentCreateModalForm = this.formBuilder.group({
      title: ['', [Validators.required, Validators.maxLength(25), Validators.pattern(ContentCreateModalPage.REGEX_START_NOBLANK)]],
      description: ['', [Validators.required, Validators.maxLength(255), Validators.pattern(ContentCreateModalPage.REGEX_START_NOBLANK)]]
    });
  }

  protected CreateNewContent() {
    if (this.contentCreateModalForm.invalid) {
      this.showAlert('Content', 'Bitte Formularfelder richtig ausfüllen.');
    }

    this.loading.present();

    const contentId = this.contentService.createContentId();

    // Choose Title Image and create Course
    this.fileService.chooseAndUploadContentVideo(this.courseId,
      contentId,
      this.contentCreateModalForm.value.title,
      this.contentCreateModalForm.value.description).then(() => {
      this.dismiss();
    });

    this.loading.dismiss();
    this.dismiss();
  }

  // close Modal View
  protected dismiss() {
    this.viewCtrl.dismiss();
  }

}
