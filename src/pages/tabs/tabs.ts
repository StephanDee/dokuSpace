import { Component } from '@angular/core';
import { ProfileTabPage } from '../profile/profile-tab';
import { CourseTabPage } from '../course/course-tab';
import { FavouriteTabPage } from '../favourite/favourite-tab';

/**
 * This class represents the Tabs Page.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {

  // Roots
  tab1Root = ProfileTabPage;
  tab2Root = CourseTabPage;
  tab3Root = FavouriteTabPage;

  /**
   * The Constructor of Tabs Page.
   */
  constructor() {}

}
