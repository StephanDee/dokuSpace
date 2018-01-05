import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, NavParams } from 'ionic-angular';
import { BasePage } from '../base/base';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { CourseContentListPage } from "../course/course-contentlist";
import { ContentService } from "../../services/content.service";
import { Content } from "../../models/content";

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

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              protected navParams: NavParams,
              private contentService: ContentService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  async ngOnInit() {
    this.courseId = this.navParams.get('courseId');
    this.contentId = this.navParams.get('contentId');
    this.contentData = this.contentService.getContent(this.courseId, this.contentId);
  }

  protected popToCourseContentListPage() {
    this.navCtrl.popTo(CourseContentListPage);
  }

}
