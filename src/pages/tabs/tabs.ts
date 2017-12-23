import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { ProfileTabPage } from '../profile/profile-tab';
import { CourseTabPage } from '../course/course-tab';
import { FavouriteTabPage } from '../favourite/favourite-tab';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage extends BasePage {

  tab1Root = ProfileTabPage;
  tab2Root = CourseTabPage;
  tab3Root = FavouriteTabPage;

  /**
   *
   * @param {NavController} navCtrl
   * @param {AlertController} alertCtrl
   * @param {LoadingController} loadingCtrl
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  async ngOnInit() {
  }

}
