import { Component } from '@angular/core';
import {
  ActionSheetController, AlertController, LoadingController, ModalController, NavController,
  NavParams
} from 'ionic-angular';
import { BasePage } from '../base/base';
import { ContentService } from '../../services/content.service';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { ContentPage } from "../content/content-page";
import { ContentEditModalPage } from '../content/modals/content-edit-modal';
import { ContentCreateModalPage } from '../content/modals/content-create-modal';
import { Content } from '../../models/content';

@Component({
  selector: 'page-course-contentlist',
  templateUrl: 'course-contentlist.html',
  providers: [ContentService]
})
export class CourseContentListPage extends BasePage {

  // Attributes
  protected courseId: string;
  protected contentListData: FirebaseListObservable<Content[]>;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              protected modalCtrl: ModalController,
              protected actionSheetCtrl: ActionSheetController,
              protected navParams: NavParams,
              private contentService: ContentService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  async ngOnInit() {
    this.courseId = this.navParams.get('courseId');
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
