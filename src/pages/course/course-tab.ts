import { Component } from '@angular/core';
import {
  ActionSheetController,
  AlertController,
  LoadingController, MenuController,
  ModalController,
  NavController
} from 'ionic-angular';
import { BasePage } from '../base/base';
import { CourseCreateModalPage } from './modals/course-create-modal';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { ContentService } from '../../services/content.service';
import { FileService } from '../../services/file.service';
import { Course } from '../../models/course';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { CourseContentListPage } from './course-contentlist';
import { CourseEditModalPage } from './modals/course-edit-modal';

/**
 * This class represents the Course Tab Page.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  selector: 'page-course-tab',
  templateUrl: 'course-tab.html',
  providers: [AuthService, CourseService, ContentService, FileService]
})
export class CourseTabPage extends BasePage {

  // Attributes
  protected authUid: string;
  protected segment = 'allcourses';
  protected courseListData: FirebaseListObservable<Course[]>;
  protected myCourseListData: FirebaseListObservable<Course[]>;

  /**
   * The Constructor of the Course Tab.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {MenuController} menuCtrl The Menu Controller, to disable SideMenu of the MyApp Class
   * @param {ModalController} modalCtrl The Modal Controller, for Modal Pages
   * @param {AuthService} authService The Auth Service, provides Methods for Contents
   * @param {CourseService} courseService The Course Service, provides Methods for Courses
   * @param {ContentService} contentService The Content Service, provides Methods for Contents
   * @param {FileService} fileService The File Service, provides Methods for Files
   * @param {ActionSheetController} actionSheetCtrl
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              protected menuCtrl: MenuController,
              protected modalCtrl: ModalController,
              private authService: AuthService,
              private courseService: CourseService,
              private contentService: ContentService,
              private fileService: FileService,
              private actionSheetCtrl: ActionSheetController) {
    super(navCtrl, alertCtrl, loadingCtrl);
    menuCtrl.enable(false);
  }

  /**
   * Loads The Course List.
   */
  ngOnInit() {
    this.authUid = this.authService.getAuthUid();
    this.courseListData = this.courseService.getCourses();
    this.myCourseListData = this.courseService.getMyCourses(this.authUid);
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
            await this.fileService.deleteCourseTitleImage(this.authUid, course.$key, course.titleImageName);

            // delete all contents of the course
            await this.contentService.getContentsSubscription(course.$key).then(async (data) => {
              for (let ids of data) {
                const contentId = ids.contentId;
                const videoName = ids.videoName;

                // content storage
                await this.fileService.deleteContentVideo(this.authUid, course.$key, contentId, videoName);

                // content database
                await this.contentService.deleteContent(course.$key);
              }
              await this.contentService.unsubscribeGetContentsSubscription();
            }).catch((err) => {
              alert('Ein Fehler ist aufgetreten: ' + err.code + '_:' + err.message);
              console.log(err);
            });

            // course database
            await this.courseListData.remove(course.$key);
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
   * Opens the Create Course Modal Page.
   */
  protected openCreateCourseModal() {
    let modal = this.modalCtrl.create(CourseCreateModalPage);
    modal.present();
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

}
