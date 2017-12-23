import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { BasePage } from '../base/base';

@Component({
  selector: 'page-favourite-tab',
  templateUrl: 'favourite-tab.html'
})
export class FavouriteTabPage extends BasePage {

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  async ngOnInit() {
  }

}
