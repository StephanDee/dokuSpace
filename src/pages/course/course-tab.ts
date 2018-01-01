import { Component } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { CourseCreateModalPage } from './modals/course-create-modal';

@Component({
  selector: 'page-course-tab',
  templateUrl: 'course-tab.html'
})
export class CourseTabPage extends BasePage {
  segment = 'allcourses';

  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              public modalCtrl: ModalController) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  async ngOnInit() {
  }

  openCreateCourseModal() {
  let modal = this.modalCtrl.create(CourseCreateModalPage);
  modal.present();
  }

}
