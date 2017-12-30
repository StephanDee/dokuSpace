import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { BasePage } from '../base/base';

@Component({
  selector: 'page-course-tab',
  templateUrl: 'course-tab.html'
})
export class CourseTabPage extends BasePage {
  segment = 'allcourses';

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  async ngOnInit() {
  }

}
