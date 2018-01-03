import { Component } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { CourseCreateModalPage } from './modals/course-create-modal';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course';
import { FirebaseListObservable } from 'angularfire2/database-deprecated';

@Component({
  selector: 'page-course-tab',
  templateUrl: 'course-tab.html',
  providers: [AuthService, CourseService]
})
export class CourseTabPage extends BasePage {

  // Attributes
  protected segment = 'allcourses';
  protected courseListData: FirebaseListObservable<Course[]>;
 //  protected myCourseListData: FirebaseListObservable<Course[]>;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              protected modalCtrl: ModalController,
              private authService: AuthService,
              private courseService: CourseService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  async ngOnInit() {
    // let authUid = this.authService.getAuthUid();
    this.courseListData = this.courseService.getCourses();
    // this.myCourseListData = this.courseService.getCourses(authUid);
  }

  protected openCreateCourseModal() {
  let modal = this.modalCtrl.create(CourseCreateModalPage);
  modal.present();
  }

}
