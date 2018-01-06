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
import { FileService } from '../../services/file.service';
import { Course } from '../../models/course';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';
import { CourseContentListPage } from './course-contentlist';
import { CourseEditModalPage } from './modals/course-edit-modal';

@Component({
  selector: 'page-course-tab',
  templateUrl: 'course-tab.html',
  providers: [AuthService, CourseService, FileService]
})
export class CourseTabPage extends BasePage {

  // Attributes
  protected authUid: string;
  protected segment = 'allcourses';
  protected courseListData: FirebaseListObservable<Course[]>;
  protected myCourseListData: FirebaseListObservable<Course[]>;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              protected menuCtrl: MenuController,
              protected modalCtrl: ModalController,
              private authService: AuthService,
              private courseService: CourseService,
              private fileService: FileService,
              private actionSheetCtrl: ActionSheetController) {
    super(navCtrl, alertCtrl, loadingCtrl);
    menuCtrl.enable(false);
  }

  async ngOnInit() {
    this.authUid = this.authService.getAuthUid();
    this.courseListData = this.courseService.getCourses();
    this.myCourseListData = this.courseService.getMyCourses(this.authUid);
  }

  selectCourseItem(course: Course) {
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
          handler: () => {
            // Delete current CourseItem

            // storage
            this.fileService.deleteCourseTitleImage(this.authUid, course.$key, course.titleImageName);

            // TODO: delete all Contents with this courseKey.

            // database
            this.courseListData.remove(course.$key);
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

  protected openCourseContentListPage(course: Course) {
    this.navCtrl.push(CourseContentListPage, {courseId: course.$key});
  }

  protected openCreateCourseModal() {
    let modal = this.modalCtrl.create(CourseCreateModalPage);
    modal.present();
  }

  protected openEditCourseModal(course: Course) {
    let modal = this.modalCtrl.create(CourseEditModalPage, {courseId: course.$key});
    modal.present();
  }

}
