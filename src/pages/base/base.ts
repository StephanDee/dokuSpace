import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';

/**
 * This class represents the Base Page of all Pages.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  selector: 'page-base',
})
export class BasePage implements OnInit {

  // For Formulars
  // Regular Expression
  public static readonly REGEX_EMAIL = /^[a-zA-Z0-9._~-]+@[a-zA-Z0-9-]+[.][a-zA-Z0-9-][a-zA-Z0-9-]+$/;
  public static readonly REGEX_START_NOBLANK = /^[^\s].*$/;

  // Attributes
  public loading: any;

  /**
   * The Constructor of Base Page.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   */
  constructor(protected navCtrl: NavController,
              protected alertCtrl: AlertController,
              protected loadingCtrl: LoadingController) {
  }

  /**
   * OnInit.
   */
  ngOnInit() {}

  /**
   * Return to Root Page for secondary Pages.
   */
  protected goToRootPage() {
    this.navCtrl.popToRoot();
  }

  /**
   * Creates a Loading Screen.
   *
   * @param {string} text The Text in the Loading Screen
   */
  protected createLoading(text: string) {
    this.loading = this.loadingCtrl.create({
      content: text
    });
  }

  /**
   * Creates an Alert.
   *
   * @param {string} title The Title of the Alert
   * @param {string} message The Message of the Alert
   */
  protected showAlert(title: string, message: string) {
    let alert = this.alertCtrl.create({
      title: title,
      message: message,
      buttons: ['Ok']
    });
    alert.present();
  }

  /**
   * Creates a Confirmation Screen.
   *
   * @param {string} title The Title of the Cofirmation
   * @param {string} message The Message of the Confirmation
   * @param cancelHandler The Cancel Handler, activated if Cancel was pushed
   * @param agreeHandler The Agree Handler, activated if Agree was pushed
   */
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
