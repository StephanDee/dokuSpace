import { Component } from '@angular/core';
import {
  ActionSheetController, AlertController, LoadingController, ModalController, NavController,
  NavParams
} from 'ionic-angular';
import { BasePage } from '../base/base';
import { AuthService } from '../../services/auth.service';
import { ContentService } from '../../services/content.service';
import { FileService } from '../../services/file.service';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { ContentPage } from "../content/content-page";
import { ContentEditModalPage } from '../content/modals/content-edit-modal';
import { ContentCreateModalPage } from '../content/modals/content-create-modal';
import { Content } from '../../models/content';

@Component({
  selector: 'page-course-contentlist',
  templateUrl: 'course-contentlist.html',
  providers: [AuthService, ContentService, FileService]
})
export class CourseContentListPage extends BasePage {

  // Attributes
  protected authUid: string;
  protected creatorUid: string;
  protected courseId: string;
  protected contentListData: FirebaseListObservable<Content[]>;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              protected modalCtrl: ModalController,
              protected actionSheetCtrl: ActionSheetController,
              protected navParams: NavParams,
              private authService: AuthService,
              private contentService: ContentService,
              private fileService: FileService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  async ngOnInit() {
    this.authUid = this.authService.getAuthUid();
    this.courseId = this.navParams.get('courseId');
    this.creatorUid = this.navParams.get('creatorUid');
    this.contentListData = this.contentService.getContents(this.courseId);
  }

  selectContentItem(content: Content) {
    this.actionSheetCtrl.create({
      title: `Content: ${content.title}`,
      buttons: [
        {
          text: 'Bearbeiten',
          handler: () => {
            // pass key to edit
            this.openEditContentModal(content);
          }
        },
        {
          text: 'Löschen',
          role: 'destructive',
          handler: () => {
            // Delete current CourseItem

            // storage
            this.fileService.deleteContentVideo(this.authUid, this.courseId, content.$key, content.videoName);
            // database
            this.contentListData.remove(content.$key);
          }
        },
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    }).present();
  }

  protected openContentPage(content: Content) {
    this.navCtrl.push(ContentPage, {courseId: this.courseId, contentId: content.$key});
  }

  protected openEditContentModal(content: Content) {
    let modal = this.modalCtrl.create(ContentEditModalPage, {courseId: this.courseId, contentId: content.$key});
    modal.present();
  }

  protected openCreateContentModal() {
    let modal = this.modalCtrl.create(ContentCreateModalPage, {courseId: this.courseId});
    modal.present();
  }

}
