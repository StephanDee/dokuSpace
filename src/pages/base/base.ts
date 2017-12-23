import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';

/**
 * This class represents the basepage of all pages.
 */
@Component({
  selector: 'page-base',
})
export class BasePage implements OnInit {

  // For Formulars
  // Email Regular Expression
  public static readonly REGEX_EMAIL = /^[a-zA-Z0-9._~-]+@[a-zA-Z0-9-]+[.][a-zA-Z0-9-][a-zA-Z0-9-]+$/;

  // Attributes
  public loading: any;

  /**
   * Contructor of basepage.
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController) {
  }

  /**
   * OnInit.
   */
  ngOnInit() {

  }

  // For secondary Pages
  protected goToRootPage() {
    this.navCtrl.popToRoot();
  }

  protected createLoading(text: string) {
    this.loading = this.loadingCtrl.create({
      content: text
    });
  }

  protected showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['Ok']
    });
    alert.present();
  }

  protected showConfirm(title: string, message: string, cancelHandler, agreeHandler) {
    let confirm = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: [
        {
          text: 'Abbrechen',
          handler: cancelHandler
        },
        {
          text: 'Bestätigen',
          handler: agreeHandler
        }
      ]
    });
    confirm.present();
  }

}
