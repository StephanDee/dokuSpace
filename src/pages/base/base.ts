import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

/**
 * This class represents the basepage of all pages.
 */
@Component({
  selector: 'page-base',
})
export class BasePage implements OnInit {

  // For Formulars
  // Email Regular Expression
  public static readonly REGEX_EMAIL = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

  /**
   * Contructor of basepage.
   */
  constructor(public navCtrl: NavController) {
  }

  /**
   * OnInit.
   */
  ngOnInit() {

  }

  // For Secondary Pages
  protected goToRootPage() {
    this.navCtrl.popToRoot();
  }

  // protected customToast(message: string, position: string, showCloseButton: boolean, closeButtonText: ''){
  //   let toast = this.toastCtrl.create({
  //     message: '',
  //     position: '',
  //     showCloseButton: true,
  //     closeButtonText: ''
  //   })
  // }

}
