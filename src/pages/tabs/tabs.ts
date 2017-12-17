import { Component } from '@angular/core';
import { ProfileTabPage } from '../profile/profile-tab';
import { AboutPage } from '../about/about';
import { ContactPage } from '../contact/contact';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProfileTabPage;
  tab2Root = AboutPage;
  tab3Root = ContactPage;

  constructor() {

  }
}
