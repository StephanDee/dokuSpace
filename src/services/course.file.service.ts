import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { FileChooser } from '@ionic-native/file-chooser';
import { AlertController, LoadingController, NavController, ToastController } from 'ionic-angular';
import { File } from '../models/file';
import { BasePage } from '../pages/base/base';
import { AuthService } from './auth.service';
import { CourseService } from './course.service';

/**
 * This class represents the Course File Service.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Injectable()
export class CourseFileService extends BasePage {

  // Attributes
  private fireStore = firebase.storage();

  /**
   * The Constructor of Course File Service.
   * All Services used here, must be set as Providers in the using classes.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {ToastController} toastCtrl The Toast Controller
   * @param {AuthService} authService The AuthService, provides Methods for the authenticated User
   * @param {CourseService} courseService The CourseService, provides Methods for the Courses
   * @param {FileChooser} fileChooser The File Chooser, imported ionic Module
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private authService: AuthService,
              private courseService: CourseService,
              private fileChooser: FileChooser) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

  /**
   * Open the FileChooser to select a File for Uploading.
   *
   * @param {string} courseId The Course ID
   * @param {string} title The Title
   * @param {string} description The Description
   * @param {string} creatorName The Creator Name
   * @param {string} creatorUid The Creator User ID
   * @param {string} creatorPhotoURL The Creator Photo Url
   * @param {string} thumbCreatorPhotoURL The Thumbnail Creator Photo Url
   * @returns {Promise<void>}
   */
  public chooseAndUploadCourseTitleImage(courseId: string, title: string, description: string, creatorName: string, creatorUid: string, creatorPhotoURL: string, thumbCreatorPhotoURL: string): Promise<void> {
    return this.fileChooser.open().then((url) => {
      (<any>window).FilePath.resolveNativePath(url, (result) => {
        let nativePath: any;
        nativePath = result;
        this.uploadCourseTitleImage(nativePath, courseId, title, description, creatorName, creatorUid, creatorPhotoURL, thumbCreatorPhotoURL);
      });
    }) as Promise<void>;
  }

  /**
   * Will upload the File to the Firebase Cloud Storage.
   *
   * @param nativePath The Native Path of the File
   * @param {string} courseId The Course ID
   * @param {string} title The Course Title
   * @param {string} description The Course Description
   * @param {string} creatorName The Course Creator Name
   * @param {string} creatorUid The Course Creator User ID
   * @param {string} creatorPhotoURL The Course Creator Photo Url
   * @param {string} thumbCreatorPhotoURL The Course Thumbnail Creator Photo Url
   */
  private uploadCourseTitleImage(nativePath: any, courseId: string, title: string, description: string, creatorName: string, creatorUid: string, creatorPhotoURL: string, thumbCreatorPhotoURL: string) {
    if (title !== null && description !== null && creatorName !== null && creatorUid !== null && creatorPhotoURL !== null && thumbCreatorPhotoURL !== null) {

      // validate Data - only upload if Datas are correct
      if (courseId === null) {
        return Promise.reject(new Error('KursId dürfen nicht null sein.'));
      }
      if (title.length < 1 || title.length > 25 || !title.match(BasePage.REGEX_START_NOBLANK)) {
        return Promise.reject(new Error('Titel muss mind. 1 und max. 25 Zeichen lang und nicht leer sein.'));
      }
      if (description.length < 1 || description.length > 255 || !description.match(BasePage.REGEX_START_NOBLANK)) {
        return Promise.reject(new Error('Beschreibung muss mind. 1 und max. 255 Zeichen lang und nicht leer sein.'));
      }
      if (creatorName.length < 1 || creatorName.length > 25 || !creatorName.match(BasePage.REGEX_START_NOBLANK)) {
        return Promise.reject(new Error('Name muss mind. 1 und max. 25 Zeichen lang und nicht leer sein.'));
      }
      if (!creatorPhotoURL.includes(File.DEFAULT_FILE_URL) && !creatorPhotoURL.includes(File.DEFAULT_FILE_URL_DIRECT)) {
        return Promise.reject(new Error('Daten dürfen nur auf die dokuSpace Cloud hochgeladen werden.'));
      }
      if (!thumbCreatorPhotoURL.includes(File.DEFAULT_FILE_URL) && !thumbCreatorPhotoURL.includes(File.DEFAULT_FILE_URL_DIRECT)) {
        return Promise.reject(new Error('Daten dürfen nur auf die dokuSpace Cloud hochgeladen werden.'));
      }

      this.createLoading('Der Kurs wird hochgeladen...');
    } else {
      this.createLoading('Titelbild wird hochgeladen...');
    }
    (<any>window).resolveLocalFileSystemURL(nativePath, (res) => {
      res.file((resFile) => {
        this.loading.present();
        // Initialize FileReader
        let reader = new FileReader();
        reader.readAsArrayBuffer(resFile);

        reader.onload = (event: any) => {

          // get file name
          let fileName = nativePath.split('/').pop();
          // get file type
          let fileType = nativePath.split('.').pop();

          if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png' || fileType === 'JPG' || fileType === 'JPEG' || fileType === 'PNG') {
            let authUid = this.authService.getAuthUid();
            let imgBlob;

            if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'JPG' || fileType === 'JPEG') {
              imgBlob = new Blob([event.target.result], {type: 'image/jpeg'});
            }
            if (fileType === 'png' || fileType === 'PNG') {
              imgBlob = new Blob([event.target.result], {type: 'image/png'});
            }

            let imageStore = this.fireStore.ref().child(`profiles/${authUid}/courses/${courseId}/${fileName}`);

            imageStore.put(imgBlob).then((res) => {

              this.setCourseOrUpdateTitleImageIdURLAndName(authUid, fileName, courseId, title, description, creatorName, creatorUid, creatorPhotoURL, thumbCreatorPhotoURL);

              if (title !== null && description !== null && creatorName !== null && creatorUid !== null && creatorPhotoURL !== null && thumbCreatorPhotoURL !== null) {
                this.createCourseUploadSuccessToast();
              } else {
                this.titleImageUploadSuccessToast();
              }

              this.loading.dismiss();
            }).catch((err) => {
              this.loading.dismiss();
              alert('Upload Failed: ' + err.code + ' _: ' + err.message);
            });
          } else {
            this.loading.dismiss();
            alert('Die Datei ist nicht vom Typ JPG, JPEG oder PNG. Kurs wurde nicht erstellt. Versuchen Sie es erneuert.');
          }
        }
      });
    });
  }

  /**
   * Set Course or update Title Image ID, Url and Name.
   *
   * @param {string} authUid The authenticated User ID
   * @param {string} fileName The File Name
   * @param {string} courseId The Course ID
   * @param {string} title The Course Title
   * @param {string} description The Course Description
   * @param {string} creatorName The Course Creator Name
   * @param {string} creatorUid The Course Creator User ID
   * @param {string} creatorPhotoURL The Course Creator Photo Url
   * @param {string} thumbCreatorPhotoURL The Course Thumbnail Creator Photo Url
   */
  private setCourseOrUpdateTitleImageIdURLAndName(authUid: string, fileName: string, courseId: string, title: string, description: string, creatorName: string, creatorUid: string, creatorPhotoURL: string, thumbCreatorPhotoURL: string) {
    this.fireStore.ref(`profiles/${authUid}/courses/${courseId}/${fileName}`).getDownloadURL().then(async (url) => {
      if (authUid !== null && title !== null && description !== null && creatorName !== null && creatorUid !== null && creatorPhotoURL !== null && thumbCreatorPhotoURL !== null) {

        // Without Cloud Functions
        // const titleImageId = this.afDb.list(`/courses`).push({}).key;
        // const titleImageId = titleImageId;
        // const titleImageUrl = url;
        // const titleImageName = fileName;
        // const thumbTitleImageUrl = url;

        await this.courseService.createCourse(courseId, title, description, creatorName, creatorUid, creatorPhotoURL, thumbCreatorPhotoURL);
      } else {
        this.courseService.getCourseSubscription(courseId).then((data) => {
          let currentTitleImageName = data.titleImageName;

          if (fileName !== currentTitleImageName) {
            this.deleteCourseTitleImage(authUid, courseId, currentTitleImageName);
          }
        });
        await this.courseService.unsubscribeGetCourseSubscription();
      }
    }).catch((err) => {
      alert('Ein Fehler ist aufgetregten: ' + err.code + ' _: ' + err.message);
      console.log(err);
    });
  }

  /**
   * Delete Course Title Image.
   *
   * @param {string} authUid The authenticated User ID
   * @param {string} courseId The Course ID
   * @param fileName The File Name
   * @returns {Promise<void>}
   */
  public deleteCourseTitleImage(authUid: string, courseId: string, fileName: any): Promise<void> {
    if (authUid === null || courseId === null || fileName === null) {
      return Promise.reject(new Error('authUid, courseId, fileName dürfen nicht null sein.'));
    }
    return this.fireStore.ref(`profiles/${authUid}/courses/${courseId}/${fileName}`).delete() &&
      this.fireStore.ref(`profiles/${authUid}/courses/${courseId}/thumb_${fileName}`).delete() as Promise<void>;
  }

  /**
   * Success Toast, Course created successfully.
   */
  private createCourseUploadSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Kurs wurde erfolgreich hochgeladen.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

  /**
   * Success Toast, Title Image Uploaded successfully.
   */
  private titleImageUploadSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Titelbild wurde erfolgreich hochgeladen.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

}
