import { Component } from '@angular/core';
import { ProfileTabPage } from '../profile/profile-tab';
import { CourseTabPage } from '../course/course-tab';
import { FavouriteTabPage } from '../favourite/favourite-tab';
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  tab1Root = ProfileTabPage;
  tab2Root = CourseTabPage;
  tab3Root = FavouriteTabPage;

  constructor() {}

}
