import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { FileChooser } from '@ionic-native/file-chooser';
import { LoadingController, ToastController } from 'ionic-angular';
import { Subscription } from 'rxjs/Subscription';
import { Photo } from '../models/photo';
import { Course } from '../models/course';
import { Content } from '../models/content';
import { File } from '../models/file';
import { BasePage } from '../pages/base/base';

/**
 * This class represents the File Service.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Injectable()
export class FileService {

  // Attributes
  private fireStore = firebase.storage();
  private loading: any;

  // @Injectable can't use other @Injectables classes. Following Attributes are from other Services.

  // Profile Service Attributes
  // private SubscriptionGetProfile: Subscription;

  // Photo Service Attributes
  private SubscriptionGetPhoto: Subscription;

  // Course Service Attributes
  // private SubscriptionGetCourses: Subscription;
  private SubscriptionGetCourse: Subscription;

  // Content Service Attributes
  private SubscriptionGetContent: Subscription;

  /**
   * The Constructor of File Service.
   *
   * @param {AngularFireAuth} afAuth The AngularFire Authentication
   * @param {AngularFireDatabase} afDb The AngularFire Database
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {ToastController} toastCtrl The Toast Controller
   * @param {FileChooser} fileChooser The File Chooser, imported ionic Module
   */
  constructor(private afAuth: AngularFireAuth,
              private afDb: AngularFireDatabase,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private fileChooser: FileChooser) {
  }

  /**
   * Creates the Loading Screen.
   *
   * @param {string} text The Text in the Loading Screen.
   */
  private createLoading(text: string) {
    this.loading = this.loadingCtrl.create({
      content: text
    });
  }

  // Start: File Upload for Profile Image
  /**
   * Open the FileChooser to select a File for Uploading.
   *
   * @returns {Promise<void>}
   */
  public chooseAndUploadProfileImage(): Promise<void> {
    return this.fileChooser.open().then((url) => {
      (<any>window).FilePath.resolveNativePath(url, (result) => {
        let nativePath: any;
        nativePath = result;
        this.uploadProfileImage(nativePath);
      });
    }) as Promise<void>;
  }

  /**
   * Will upload the File to the Firebase Cloud Storage.
   *
   * @param nativePath The Navite Path of the File
   */
  private uploadProfileImage(nativePath: any) {
    this.createLoading('Das Profilbild wird hochgeladen...');
    this.loading.present();
    (<any>window).resolveLocalFileSystemURL(nativePath, (res) => {
      res.file((resFile) => {

        // Initialize FileReader
        let reader = new FileReader();
        reader.readAsArrayBuffer(resFile);

        reader.onload = async (event: any) => {

          // get file name
          let fileName = nativePath.split('/').pop();
          // get file type
          let fileType = nativePath.split('.').pop();

          if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png' || fileType === 'JPG' || fileType === 'JPEG' || fileType === 'PNG') {
            let authUid = this.getAuthUid();
            let imgBlob;

            // if photoName already used, delete PhotoEntry from Database and File from Storage.
            // File will be automatically overwritten in Storage, but the Cloud Function laggs executing
            // if File already exist
            await this.getPhotoSubscription(authUid).then(async (data) => {
              for (let ids of data) {
                const photoId = ids.photoId;
                const photoName = ids.photoName;
                if (photoName === fileName) {
                  // alert('Photo to delete: ' + photoName);
                  this.deleteProfilePhoto(authUid, photoId);

                  // should not be needed like in the other uploaders,
                  // but somehow it reduces the lag of uploading the new File
                  this.deleteProfileImage(authUid, fileName);
                }
              }
              await this.unsubscribeGetPhotoSubscription();
            });

            if (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'JPG' || fileType === 'JPEG') {
              imgBlob = new Blob([event.target.result], {type: 'image/jpeg'});
            }
            if (fileType === 'png' || fileType === 'PNG') {
              imgBlob = new Blob([event.target.result], {type: 'image/png'});
            }
            let imageStore = this.fireStore.ref().child(`profiles/${authUid}/photo/${fileName}`);

            await imageStore.put(imgBlob).then((res) => {

              this.profileImageUploadSuccessToast();
              this.loading.dismiss();
            }).catch((err) => {
              this.loading.dismiss();
              alert('Upload Failed: ' + err.code + ' _: ' + err.message);
            });
          } else {
            this.loading.dismiss();
            alert('Die Datei ist nicht vom Typ JPG, JPEG oder PNG. Profilbild wurde nicht erstellt. Versuchen Sie es erneuert.');
          }
        }
      });
    });
  }

  /**
   * Delete Profile Image.
   *
   * @param {string} authUid The authenticated User ID
   * @param fileName The FileName
   * @returns {Promise<void>}
   */
  public deleteProfileImage(authUid: string, fileName: any): Promise<void> {
    if (authUid === null || fileName === null) {
      return Promise.reject(new Error('AuthUid und fileName darf nicht null sein.'));
    }
    return this.fireStore.ref(`profiles/${authUid}/photo/${fileName}`).delete() &&
      this.fireStore.ref(`profiles/${authUid}/photo/thumb_${fileName}`).delete() as Promise<void>;
  }

  /**
   * Success Toast, The Profile Image was Uploaded successfully.
   */
  private profileImageUploadSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Profilbild wurde erfolgreich hochgeladen.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

  // End: File Upload for Profile Image

  // Start: File Upload for Course Title Image
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
            let authUid = this.getAuthUid();
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
        //const titleImageId = this.afDb.list(`/courses`).push({}).key;

        const course = new Course();
        course.courseId = courseId;
        course.title = title;
        course.description = description;
        course.creatorName = creatorName;
        course.creatorUid = creatorUid;
        course.creatorPhotoURL = creatorPhotoURL;
        course.thumbCreatorPhotoURL = thumbCreatorPhotoURL;
        // favourite for dummy purposes
        course.favourite = false;
        // course.titleImageId = titleImageId;
        // course.titleImageUrl = url;
        // course.titleImageName = fileName;
        // course.thumbTitleImageUrl = url;

        // Courses Services
        await this.afDb.object(`/courses/${courseId}`).set(course);
      } else {
        this.getCourseSubscription(courseId).then((data) => {
          let currentTitleImageName = data.titleImageName;

          if (fileName !== currentTitleImageName) {
            this.deleteCourseTitleImage(authUid, courseId, currentTitleImageName);
          }
        });
        await this.unsubscribeGetCourseSubscription();

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

  // End: File Upload for Course Title Image


  // Start: File Upload for Content Video
  /**
   * Open the FileChooser to select a File for Uploading.
   *
   * @param {string} courseId The Course ID
   * @param {string} contentId The Content ID
   * @param {string} title The Content Title
   * @param {string} description The Content Description
   * @returns {Promise<void>}
   */
  public chooseAndUploadContentVideo(courseId: string, contentId: string, title: string, description: string): Promise<void> {
    return this.fileChooser.open().then((url) => {
      (<any>window).FilePath.resolveNativePath(url, (result) => {
        let nativePath: any;
        nativePath = result;
        this.uploadContentVideo(nativePath, courseId, contentId, title, description);
      });
    }) as Promise<void>;
  }

  /**
   * Will upload the file to the Firebase Cloud Storage.
   *
   * @param nativePath The Native Path of the File
   * @param {string} courseId The Course ID
   * @param {string} contentId The Content ID
   * @param {string} title The Content Title
   * @param {string} description The Content Description
   */
  private uploadContentVideo(nativePath: any, courseId: string, contentId: string, title: string, description: string) {
    if (title !== null && description !== null) {
      this.createLoading('Content wird hochgeladen...');
    } else {
      this.createLoading('Video wird hochgeladen...');
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

          if (fileType === 'mp4' || fileType === 'MP4') {
            let authUid = this.getAuthUid();
            let imgBlob;

            imgBlob = new Blob([event.target.result], {type: 'video/mp4'});

            let imageStore = this.fireStore.ref().child(`profiles/${authUid}/contents/${courseId}/${contentId}/${fileName}`);

            imageStore.put(imgBlob).then((res) => {

              this.setContentOrUpdateVideoIdURLAndName(authUid, fileName, courseId, contentId, title, description);

              if (title !== null && description !== null) {
                this.createContentUploadSuccessToast();
              } else {
                this.videoUploadSuccessToast();
              }

              this.loading.dismiss();
            }).catch((err) => {
              this.loading.dismiss();
              alert('Upload Failed: ' + err.code + ' _: ' + err.message);
            });
          } else {
            this.loading.dismiss();
            alert('Die Datei ist nicht vom Typ MP4. Content wurde nicht erstellt. Versuchen Sie es erneuert.');
          }
        }
      });
    });
  }

  /**
   * Set Content Or Update Video ID, Url and Name.
   *
   * @param {string} authUid The authenticated User ID
   * @param {string} fileName The FileName
   * @param {string} courseId The Course ID
   * @param {string} contentId The Content ID
   * @param {string} title The Content Title
   * @param {string} description The Content Description
   */
  private setContentOrUpdateVideoIdURLAndName(authUid: string, fileName: string, courseId: string, contentId: string, title: string, description: string) {
    this.fireStore.ref(`profiles/${authUid}/contents/${courseId}/${contentId}/${fileName}`).getDownloadURL().then(async (url) => {
      if (title !== null && description !== null) {
        // validate Data
        if (authUid === null || courseId === null || contentId === null) {
          return Promise.reject(new Error('AuthUid, KursId und ContentId dürfen nicht null sein.'));
        }
        if (title.length < 1 || title.length > 25 || !title.match(BasePage.REGEX_START_NOBLANK)) {
          return Promise.reject(new Error('Name muss mind. 1 und max. 25 Zeichen lang und nicht leer sein.'));
        }
        if (description.length < 1 || description.length > 255 || !description.match(BasePage.REGEX_START_NOBLANK)) {
          return Promise.reject(new Error('Beschreibung muss mind. 1 und max. 255 Zeichen lang und nicht leer sein.'));
        }

        const videoId = this.afDb.list(`/contents`).push({}).key;
        const content = new Content();
        content.contentId = contentId;
        content.title = title;
        content.description = description;
        content.creatorUid = authUid;
        content.videoId = videoId;
        content.videoName = fileName;
        content.videoUrl = url;

        // Content Services
        await this.afDb.object(`/contents/${courseId}/${contentId}`).set(content);
      } else {
        this.getContentSubscription(courseId, contentId).then((data) => {
          let currentVideoName = data.videoName;

          if (fileName !== currentVideoName) {
            this.deleteContentVideo(authUid, courseId, contentId, currentVideoName);
          }
        });
        await this.unsubscribeGetContentSubscription();

        // Content Services
        await this.afDb.object(`/contents/${courseId}/${contentId}/`).update({videoUrl: url, videoName: fileName});
      }
    }).catch((err) => {
      alert('Ein Fehler ist aufgetregten: ' + err.code + ' _: ' + err.message);
      console.log(err);
    });
  }

  /**
   * Delete Content Video.
   *
   * @param {string} authUid The authenticated User ID
   * @param {string} courseId The Course ID
   * @param {string} contentId The Content ID
   * @param fileName The File Name
   * @returns {Promise<void>}
   */
  public deleteContentVideo(authUid: string, courseId: string, contentId: string, fileName: any): Promise<void> {
    if (authUid === null || courseId === null || contentId === null || fileName === null) {
      return Promise.reject(new Error('User ID darf nicht null sein.'));
    }
    return this.fireStore.ref(`profiles/${authUid}/contents/${courseId}/${contentId}/${fileName}`).delete() as Promise<void>;
  }

  /**
   * Success Toast, the Content created successfully.
   */
  private createContentUploadSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Content wurde erfolgreich hochgeladen.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

  /**
   * Success Toast, the Video uploaded successfully.
   */
  private videoUploadSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Video wurde erfolgreich hochgeladen.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

  // End: File Upload for Content Video


  // @Injectable can't use other @Injectables classes. Following Methods are from other Services.

  // Auth Services
  // Auth Service Method.
  private getAuthUid(): string {
    return this.afAuth.auth.currentUser.uid as string;
  }

  // Profile Services
  // Profile Service Method.
  // private getProfileSubscription(uid: string): Promise<Profile> {
  //   return new Promise(resolve => {
  //     this.SubscriptionGetProfile = this.afDb.object(`profiles/${uid}`).subscribe((data) => {
  //       resolve(data);
  //     });
  //   });
  // }

  // Profile Service Method.
  // private unsubscribeGetProfileSubscription() {
  //   this.SubscriptionGetProfile.unsubscribe();
  // }

  // Photo Services
  // Photo Service Method.
  private getPhotoSubscription(uid: string): Promise<Photo[]> {
    return new Promise(resolve => {
      this.SubscriptionGetPhoto = this.afDb.list(`photos/${uid}`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  // Photo Service Method.
  private unsubscribeGetPhotoSubscription() {
    this.SubscriptionGetPhoto.unsubscribe();
  }

  // Photo Service Method.
  private deleteProfilePhoto(authUid: string, photoId: string): Promise<void> {
    if (authUid === null || photoId === null) {
      return Promise.reject(new Error('User ID oder photo ID darf nicht null sein.'));
    }
    return this.afDb.object(`/photos/${authUid}/${photoId}`).remove() as Promise<void>;
  }

  // Course Services
  // Course Service Method.
  // private getCoursesSubscription(): Promise<Course[]> {
  //   return new Promise(resolve => {
  //     this.SubscriptionGetCourses = this.afDb.list(`/courses/`).subscribe((data) => {
  //       resolve(data);
  //     });
  //   });
  // }

  // Course Service Method.
  // private unsubscribeGetCoursesSubscription() {
  //   this.SubscriptionGetCourses.unsubscribe();
  // }

  // Course Service Method.
  private getCourseSubscription(courseId: string): Promise<Course> {
    return new Promise(resolve => {
      this.SubscriptionGetCourse = this.afDb.object(`/courses/${courseId}`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  // Course Service Method.
  private unsubscribeGetCourseSubscription() {
    this.SubscriptionGetCourse.unsubscribe();
  }

  // Content Services
  // Content Service Method.
  private getContentSubscription(courseId: string, contentId: string): Promise<Content> {
    return new Promise(resolve => {
      this.SubscriptionGetContent = this.afDb.object(`/contents/${courseId}/${contentId}`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  // Content Service Method.
  private unsubscribeGetContentSubscription() {
    this.SubscriptionGetContent.unsubscribe();
  }

}
