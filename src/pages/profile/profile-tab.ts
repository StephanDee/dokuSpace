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
import { ProfileFileService } from '../../services/profile.file.service';
import { PhotoService } from '../../services/photo.service';
import { CourseService } from '../../services/course.service';
import { Profile } from '../../models/profile';
import { ProfileNameModalPage } from './modals/profile-name-modal';
import { ProfileEmailModalPage } from './modals/profile-email-modal';

/**
 * This class represents the Profile Tab Page.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Component({
  selector: 'page-profile-tab',
  templateUrl: 'profile-tab.html',
  providers: [ProfileService, AuthService, ProfileFileService, PhotoService, CourseService]
})
export class ProfileTabPage extends BasePage {

  // Attributes
  protected profileData: FirebaseObjectObservable<Profile>;

  /**
   * The Constructor of Profile Tab Page.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {MenuController} menuCtrl The MenuController, to enable SideMenu from the MyApp class
   * @param {ModalController} modalCtrl The Modal Controller for the Modal Pages
   * @param {AuthService} authService The Auth Service, provides Methods for the Authenticated User
   * @param {ProfileService} profileService The Profile Service, provides Methods for the Profiles
   * @param {ProfileFileService} profileFileService The Profile File Service, provides Methods for the Profile Files
   * @param {PhotoService} photoService The Photo Service, provides Methods for the Photos
   * @param {CourseService} courseService The Course Service, provides Methods for the Courses
   */
  constructor(protected navCtrl: NavController,
              protected alertCtrl: AlertController,
              protected loadingCtrl: LoadingController,
              protected menuCtrl: MenuController,
              protected modalCtrl: ModalController,
              private authService: AuthService,
              private profileService: ProfileService,
              private profileFileService: ProfileFileService,
              private photoService: PhotoService,
              private courseService: CourseService) {
    super(navCtrl, alertCtrl, loadingCtrl);
    this.menuCtrl.enable(false);
  }

  /**
   * Loads the Profile to display on the HTML.
   */
  ngOnInit() {
    const authUid = this.authService.getAuthUid();
    this.profileData = this.profileService.getProfile(authUid);
  }

  /**
   * Deletes a Profile Photo.
   */
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
        // delete profileImage in Cloud Storage
        this.profileFileService.deleteProfileImage(authUid, photoName);

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

        // delete photoId and photoName in Profile
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

  /**
   * Choose and Upload a Profile Photo.
   */
  protected chooseAndUploadProfilePhoto() {
    this.profileFileService.chooseAndUploadProfileImage();
  }

  /**
   * Opens Edit Profile Name Modal Page.
   *
   * @param {ItemSliding} slidingItemName
   */
  protected editProfileName(slidingItemName: ItemSliding) {
    slidingItemName.close();
    let modal = this.modalCtrl.create(ProfileNameModalPage);
    modal.present();
  }

  /**
   * Opens Edit Profile Email Modal Page.
   *
   * @param {ItemSliding} slidingItemEmail
   */
  protected editProfileEmail(slidingItemEmail: ItemSliding) {
    slidingItemEmail.close();
    let modal = this.modalCtrl.create(ProfileEmailModalPage);
    modal.present();
  }

  /**
   * View Entered.
   */
  ionViewDidEnter() {
    this.menuCtrl.enable(true);
  }

  /**
   * View left.
   */
  ionViewDidLeave() {
    this.menuCtrl.enable(false);
  }
}
