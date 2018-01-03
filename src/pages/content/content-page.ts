import { Component } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { AuthService } from '../../services/auth.service';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course';
import { FirebaseObjectObservable } from 'angularfire2/database-deprecated';

@Component({
  selector: 'page-content-page',
  templateUrl: 'content-page.html',
  providers: [AuthService, CourseService]
})
export class ContentPage extends BasePage {

  // Attributes
  protected courseData: FirebaseObjectObservable<Course>;

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              // protected modalCtrl: ModalController,
              private authService: AuthService,
              private courseService: CourseService) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  async ngOnInit() {
    let authUid = this.authService.getAuthUid();
    this.courseData = this.courseService.getCourse(authUid);
  }

  protected openEditCourseModal() {
    // let modal = this.modalCtrl.create(CourseEditModalPage);
    // modal.present();
  }

}
