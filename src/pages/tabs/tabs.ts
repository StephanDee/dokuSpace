import { Component } from '@angular/core';
import { ProfileTabPage } from '../profile/profile-tab';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';

// import { ViewChild } from '@angular/core';
// import { Tabs } from 'ionic-angular';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  // ref to tabs in tabs.html
  // @ViewChild('myTabs') tabRef: Tabs;

  tab1Root = ProfileTabPage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor() {

  }

  /**
   * Select tab index.
   */
  // ionViewDidEnter() {
  //   this.tabRef.select(1);
  // }
}
