import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams } from 'ionic-angular';
import { BasePage } from '../base/base';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { CourseContentListPage } from '../course/course-contentlist';
import { ContentService } from '../../services/content.service';
import { Content } from '../../models/content';

/**
 * This class represents the Content Page.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  selector: 'page-content-page',
  templateUrl: 'content-page.html',
  providers: [ContentService]
})
export class ContentPage extends BasePage {

  // Attributes
  protected courseId: string;
  protected contentId: string;
  protected contentData: FirebaseObjectObservable<Content>;

  /**
   * The Constructor of the Content Page.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {NavParams} navParams The Navigation Params from the other Page
   * @param {ContentService} contentService The Content Service, provides Methods for Contents
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              protected navParams: NavParams,
              private contentService: ContentService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  /**
   * Loads the Content to display it on the HTML.
   */
  ngOnInit() {
    this.courseId = this.navParams.get('courseId');
    this.contentId = this.navParams.get('contentId');
    this.contentData = this.contentService.getContent(this.courseId, this.contentId);
  }

  /**
   * Pops back to the previous Page.
   */
  protected popToCourseContentListPage() {
    this.navCtrl.popTo(CourseContentListPage);
  }

}
