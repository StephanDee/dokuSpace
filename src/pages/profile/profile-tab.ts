import { Component } from '@angular/core';
import {
  AlertController,
  LoadingController,
  MenuController,
  ModalController,
  NavController,
  ItemSliding
} from 'ionic-angular';
import { BasePage } from '../base/base';
import { FirebaseObjectObservable } from "angularfire2/database-deprecated";
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../services/auth.service';
import { Profile } from '../../models/profile';
import { ProfileNameModalPage } from './modals/profile-name-modal';
import { ProfileEmailModalPage } from './modals/profile-email-modal';
import { FileService } from '../../services/file.service';
import { PhotoService } from '../../services/photo.service';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'page-profile-tab',
  templateUrl: 'profile-tab.html',
  providers: [ProfileService, AuthService, FileService, PhotoService, CourseService]
})
export class ProfileTabPage extends BasePage {

  protected profileData: FirebaseObjectObservable<Profile>;

  /**
   *
   * @param {NavController} navCtrl
   * @param {AlertController} alertCtrl
   * @param {LoadingController} loadingCtrl
   * @param {MenuController} menuCtrl
   * @param {ModalController} modalCtrl
   * @param {AuthService} authService
   * @param {ProfileService} profileService
   * @param {FileService} fileService
   * @param {PhotoService} photoService
   * @param {CourseService} courseService
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              protected menuCtrl: MenuController,
              protected modalCtrl: ModalController,
              private authService: AuthService,
              private profileService: ProfileService,
              private fileService: FileService,
              private photoService: PhotoService,
              private courseService: CourseService) {
    super(navCtrl, alertCtrl, loadingCtrl);
    this.menuCtrl.enable(false);
  }

  async ngOnInit() {
    const authUid = this.authService.getAuthUid();
    this.profileData = this.profileService.getProfile(authUid);
  }

  protected deleteProfilePhoto() {
    this.showConfirm('Profilbild löschen', 'Möchten Sie das Profilbild wirklich löschen?', this.cancelHandler, this.agreeHandler);
  }

  private cancelHandler = () => {
  };
  private agreeHandler = () => {
    this.createLoading('Profilbild wird gelöscht...');
    this.loading.present();
    const authUid = this.authService.getAuthUid();

    // get Profile Data
    this.profileService.getProfileSubscription(authUid).then(async (data) => {

      let photoId = data.photoId;
      let photoName = data.photoName;

      if (photoName !== undefined && photoId !== undefined) {
        this.fileService.deleteProfileImage(authUid, photoName);

        // update creatorPhotoURL for courses, when user deleted photoURL and set to default PhotoURL
        await this.courseService.getCoursesSubscription().then(async (data) => {
          for (let ids of data) {
            const courseId = ids.courseId;
            const creatorUid = ids.creatorUid;
            if (authUid === creatorUid) {
              this.courseService.updateCoursePhotoURLToDefault(courseId);
            }
          }
          await this.courseService.unsubscribeGetCoursesSubscription();
        }).catch((err) => {
          console.log(err);
        });

        // delete photoId and photoName
        this.profileService.deleteProfilePhotoId(authUid);
        this.profileService.deleteProfilePhotoName(authUid);

        // update URL to Default
        this.profileService.updateProfilePhotoURLToDefault(authUid);

        // delete current photos entry
        this.photoService.deleteProfilePhoto(authUid, photoId);
      } else {
        this.showAlert('Profilbild', 'Es ist kein Profilbild vorhanden.')
      }
      this.loading.dismiss();
    }).catch((err) => {
      this.loading.dismiss();
      alert(err);
    });
    this.profileService.unsubscribeGetProfileSubscription();
  };

  protected chooseAndUploadProfilePhoto() {
    this.fileService.chooseAndUploadProfileImage();
  }

  protected editProfileName(slidingItemName: ItemSliding) {
    slidingItemName.close();
    let modal = this.modalCtrl.create(ProfileNameModalPage);
    modal.present();
  }

  protected editProfileEmail(slidingItemEmail: ItemSliding) {
    slidingItemEmail.close();
    let modal = this.modalCtrl.create(ProfileEmailModalPage);
    modal.present();
  }

  ionViewDidEnter() {
    this.menuCtrl.enable(true);
  }

  ionViewDidLeave() {
    this.menuCtrl.enable(false);
  }
}
