import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { BasePage } from '../base/base';

/**
 * This class represents the Favourite Tab Page.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  selector: 'page-favourite-tab',
  templateUrl: 'favourite-tab.html'
})
export class FavouriteTabPage extends BasePage {

  /**
   * The Constructor of Favourite Tab Page.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  /**
   * OnInit.
   */
  ngOnInit() {
  }

}
