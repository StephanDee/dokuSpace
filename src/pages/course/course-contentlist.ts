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
import { ContentPage } from '../content/content-page';
import { ContentEditModalPage } from '../content/modals/content-edit-modal';
import { ContentCreateModalPage } from '../content/modals/content-create-modal';
import { Content } from '../../models/content';

/**
 * This class represents the Course Content List Page.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
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

  /**
   * The Constructor of the Course Content List Page.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {ModalController} modalCtrl The Modal Controller, used for Modals in this Page
   * @param {ActionSheetController} actionSheetCtrl The Action Sheet Controller, used for the Action Sheet in this Page
   * @param {NavParams} navParams The Navigation Parameter from the previous Page
   * @param {AuthService} authService The Auth Service, provides Methods for the Authenticated User
   * @param {ContentService} contentService The Content Service, provides Methods for the Contents
   * @param {FileService} fileService the File Service, provides Methods for the Files
   */
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

  /**
   * Loads the Course Parameter from the previous Page and loads the List of Contents.
   */
  ngOnInit() {
    this.authUid = this.authService.getAuthUid();
    this.courseId = this.navParams.get('courseId');
    this.creatorUid = this.navParams.get('creatorUid');
    this.contentListData = this.contentService.getContents(this.courseId);
  }

  /**
   * Selects the selected CourseItem and open an Action Sheet with 3 options.
   * Edit, Delete, Cancel.
   *
   * @param {Content} content The selected Content
   */
  protected selectContentItem(content: Content) {
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

  /**
   * Opens the Content Page.
   *
   * @param {Content} content The selected Content
   */
  protected openContentPage(content: Content) {
    this.navCtrl.push(ContentPage, {courseId: this.courseId, contentId: content.$key});
  }

  /**
   * Opens the Edit Content Modal Page.
   *
   * @param {Content} content The selected Content
   */
  protected openEditContentModal(content: Content) {
    let modal = this.modalCtrl.create(ContentEditModalPage, {courseId: this.courseId, contentId: content.$key});
    modal.present();
  }

  /**
   * Opens the Create Content Modal Page.
   */
  protected openCreateContentModal() {
    let modal = this.modalCtrl.create(ContentCreateModalPage, {courseId: this.courseId});
    modal.present();
  }

}
