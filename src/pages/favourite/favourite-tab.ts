import { Component } from '@angular/core';
import {
  ActionSheetController, AlertController, LoadingController, ModalController,
  NavController
} from 'ionic-angular';
import { BasePage } from '../base/base';
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { AuthService } from '../../services/auth.service';
import { ProfileService } from '../../services/profile.service';
import { ContentService } from '../../services/content.service';
import { CourseFileService } from '../../services/course.file.service';
import { ContentFileService } from '../../services/content.file.service';
import { CourseService } from '../../services/course.service';
import { CourseEditModalPage } from '../course/modals/course-edit-modal';
import { CourseContentListPage } from '../course/course-contentlist';
import { Course } from '../../models/course';
import { Profile, Role } from '../../models/profile';

/**
 * This class represents the Favourite Tab Page.
 * Added for Dummy purposes.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  selector: 'page-favourite-tab',
  templateUrl: 'favourite-tab.html',
  providers: [AuthService, ProfileService, CourseService, ContentService, CourseFileService, ContentFileService]
})
export class FavouriteTabPage extends BasePage {

  // Attributes
  protected authUid: string;
  protected profileRoleTeacher: Role.TEACHER;
  protected profileData: FirebaseObjectObservable<Profile>;
  protected favouriteCourseListData: FirebaseListObservable<Course[]>;

  /**
   * The Constructor of Favourite Tab Page.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {ModalController} modalCtrl The Modal Controller
   * @param {AuthService} authService The Auth Service, provides Methods for the authenticated User
   * @param {ProfileService} profileService The Profile Service, provides Methods for Profiles
   * @param {CourseService} courseService The Course Service, provides Methods for Courses
   * @param {ContentService} contentService The Content Service, provides Methods for Contents
   * @param {CourseFileService} courseFileService The Course File Service, provides Methods for Course Files
   * @param {ContentFileService} contentFileService The Content File Service, provides Methods for Content Files
   * @param {ActionSheetController} actionSheetCtrl The actionSheet Controller
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              protected modalCtrl: ModalController,
              private authService: AuthService,
              private profileService: ProfileService,
              private courseService: CourseService,
              private contentService: ContentService,
              private courseFileService: CourseFileService,
              private contentFileService: ContentFileService,
              private actionSheetCtrl: ActionSheetController) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  /**
   * OnInit.
   */
  ngOnInit() {
    this.authUid = this.authService.getAuthUid();
    this.profileRoleTeacher = Role.TEACHER;
    this.profileData = this.profileService.getProfile(this.authUid);
    this.favouriteCourseListData = this.courseService.getMyFavouriteCourses();
  }

  /**
   * Selects the selected CourseItem and open an Action Sheet with 3 options.
   * Edit, Delete, Cancel.
   *
   * @param {Course} course The selected Course
   */
  protected selectCourseItem(course: Course) {
    this.actionSheetCtrl.create({
      title: `Kurs: ${course.title}`,
      buttons: [
        {
          text: 'Bearbeiten',
          handler: () => {
            // pass key to edit
            this.openEditCourseModal(course);
          }
        },
        {
          text: 'Löschen',
          role: 'destructive',
          handler: async () => {
            // Delete current CourseItem and its Contents

            // course storage
            await this.courseFileService.deleteCourseTitleImage(this.authUid, course.$key, course.titleImageName);

            // delete all contents of the course
            await this.contentService.getContentsSubscription(course.$key).then(async (data) => {
              for (let ids of data) {
                const contentId = ids.contentId;
                const videoName = ids.videoName;

                // content storage
                await this.contentFileService.deleteContentVideo(this.authUid, course.$key, contentId, videoName);

                // content database
                await this.contentService.deleteContent(course.$key);
              }
              await this.contentService.unsubscribeGetContentsSubscription();
            }).catch((err) => {
              alert('Ein Fehler ist aufgetreten: ' + err.code + '_:' + err.message);
              console.log(err);
            });

            // course database
            try {
              await this.favouriteCourseListData.remove(course.$key);
            } catch(err) {
              this.showAlert('Kurs', 'Ein Fehler ist aufgetreten: ' + err.message )
            }
          }
        },
        {
          text: 'Abbrechen',
          role: 'cancel',
          handler: () => {
          }
        }
      ]
    }).present();
  }

  /**
   * Opens the Course Content List Page.
   *
   * @param {Course} course The selected Course
   */
  protected openCourseContentListPage(course: Course) {
    this.navCtrl.push(CourseContentListPage, {courseId: course.$key, creatorUid: course.creatorUid});
  }

  /**
   * Opens the Edit Course Modal Page.
   *
   * @param {Course} course The selected Course
   */
  protected openEditCourseModal(course: Course) {
    let modal = this.modalCtrl.create(CourseEditModalPage, {courseId: course.$key});
    modal.present();
  }

  /**
   * Sets the Course to Favourites.
   * At the moment only for Dummy purposes.
   *
   * @param {Course} course The selected Course
   */
  favouriteCourse(course: Course) {
    if (course.favourite === true) {
      this.courseService.setFavourite(course.$key, false);
    }
    if (course.favourite === false || course.favourite === null || course.favourite === undefined) {
      this.courseService.setFavourite(course.$key, true);
    }
  }

}
