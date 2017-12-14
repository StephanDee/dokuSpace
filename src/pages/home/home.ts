import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BasePage } from "../base/base";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage extends BasePage {

  constructor(public navCtrl: NavController) {
    super(navCtrl);
  }

}
