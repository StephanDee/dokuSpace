import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import * as firebase from "firebase";
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { FileChooser } from '@ionic-native/file-chooser';
import { LoadingController, ToastController } from "ionic-angular";
import { Profile } from '../models/profile';
import { Subscription } from 'rxjs/Subscription';
import { Photo } from '../models/photo';
import { Course } from '../models/course';
import { Content } from "../models/content";
import { File } from "../models/file";
import { BasePage } from "../pages/base/base";

@Injectable()
export class FileService {

  // Attributes
  private fireStore = firebase.storage();
  private loading: any;

  // Profile Service Attribute
  private SubscriptionGetProfile: Subscription;

  // Photo Service Attribute
  private SubscriptionGetPhoto: Subscription;

  // Course Service Attribute
  private SubscriptionGetCourses: Subscription;
  private SubscriptionGetCourse: Subscription;

  // Content Service Attribute
  private SubscriptionGetContent: Subscription;

  /**
   *
   * @param {AngularFireAuth} afAuth
   * @param {AngularFireDatabase} afDb
   * @param {LoadingController} loadingCtrl
   * @param {ToastController} toastCtrl
   * @param {FileChooser} fileChooser
   */
  constructor(private afAuth: AngularFireAuth,
              private afDb: AngularFireDatabase,
              private loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private fileChooser: FileChooser) {
  }

  private createLoading(text: string) {
    this.loading = this.loadingCtrl.create({
      content: text
    });
  }

  // Start: File Upload for Profile Image
  public chooseAndUploadProfileImage(): Promise<void> {
    return this.fileChooser.open().then((url) => {
      (<any>window).FilePath.resolveNativePath(url, (result) => {
        let nativePath: any;
        nativePath = result;
        this.uploadProfileImage(nativePath);
      });
    }) as Promise<void>;
  }

  private uploadProfileImage(nativePath: any) {
    this.createLoading('Das Profilbild wird hochgeladen...');
    this.loading.present();
    (<any>window).resolveLocalFileSystemURL(nativePath, (res) => {
      res.file((resFile) => {

        // Initialize FileReader
        let reader = new FileReader();
        reader.readAsArrayBuffer(resFile);

        reader.onload = (event: any) => {

          // get file name
          let partsOfUrl = nativePath.split('/');
          let fileName = partsOfUrl.pop() || partsOfUrl.pop();

          // get file type
          let getFileType = nativePath.split('.');
          let fileType = getFileType.pop() || getFileType.pop();

          if (fileType !== ('jpg' || 'jpeg' || 'png' || 'JPG' || 'JPEG' || 'PNG')) {
            this.loading.dismiss();
            alert('Die Datei ist nicht vom Typ JPG, JPEG oder PNG. Profilbild wurde nicht erstellt. Versuchen Sie es erneuert.');
          } else {
            let authUid = this.getAuthUid();
            let imgBlob;

            // if photoName already used, delete PhotoEntry from Database. File will be automatically overwritten in Storage.
            this.getPhotoSubscription(authUid).then(async (data) => {
              for (let ids of data) {
                const photoId = ids.photoId;
                const photoName = ids.photoName;
                if (photoName === fileName) {
                  // alert('Photo to delete: ' + photoName);
                  this.deleteProfilePhoto(authUid, photoId);
                }
              }
              await this.unsubscribeGetPhotoSubscription();
            });

            if (fileType === ('jpg' || 'jpeg' || 'JPG' || 'JPEG')) {
              imgBlob = new Blob([event.target.result], {type: 'image/jpeg'});
            }
            if (fileType === ('png' || 'PNG')) {
              imgBlob = new Blob([event.target.result], {type: 'image/png'});
            }
            let imageStore = this.fireStore.ref().child(`profiles/${authUid}/photo/${fileName}`);

            imageStore.put(imgBlob).then((res) => {

              this.profileImageUploadSuccessToast();
              this.loading.dismiss();
            }).catch((err) => {
              this.loading.dismiss();
              alert('Upload Failed: ' + err.code + ' _: ' + err.message);
            });
          }
        }
      });
    });
  }

  public deleteProfileImage(authUid: string, fileName: any): Promise<void> {
    return this.fireStore.ref(`profiles/${authUid}/photo/${fileName}`).delete() &&
      this.fireStore.ref(`profiles/${authUid}/photo/thumb_${fileName}`).delete() as Promise<void>;
  }

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
  public chooseAndUploadCourseTitleImage(courseId: string, title: string, description: string, creatorName: string, creatorUid: string, creatorPhotoURL: string, thumbCreatorPhotoURL: string): Promise<void> {
    return this.fileChooser.open().then((url) => {
      (<any>window).FilePath.resolveNativePath(url, (result) => {
        let nativePath: any;
        nativePath = result;
        this.uploadCourseTitleImage(nativePath, courseId, title, description, creatorName, creatorUid, creatorPhotoURL, thumbCreatorPhotoURL);
      });
    }) as Promise<void>;
  }

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
          let partsOfUrl = nativePath.split('/');
          let fileName = partsOfUrl.pop() || partsOfUrl.pop();

          // get file type
          let getFileType = nativePath.split('.');
          let fileType = getFileType.pop() || getFileType.pop();

          if (fileType !== ('jpg' || 'jpeg' || 'png' || 'JPG' || 'JPEG' || 'PNG')) {
            this.loading.dismiss();
            alert('Die Datei ist nicht vom Typ JPG, JPEG oder PNG. Kurs wurde nicht erstellt. Versuchen Sie es erneuert.');
          } else {
            let authUid = this.getAuthUid();
            let imgBlob;

            if (fileType === ('jpg' || 'jpeg' || 'JPG' || 'JPEG')) {
              imgBlob = new Blob([event.target.result], {type: 'image/jpeg'});
            }
            if (fileType === ('png' || 'PNG')) {
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
          }
        }
      });
    });
  }

  private setCourseOrUpdateTitleImageIdURLAndName(authUid: string, fileName: string, courseId: string, title: string, description: string, creatorName: string, creatorUid: string, creatorPhotoURL: string, thumbCreatorPhotoURL: string) {
    this.fireStore.ref(`profiles/${authUid}/courses/${courseId}/${fileName}`).getDownloadURL().then(async (url) => {
      if (title !== null && description !== null && creatorName !== null && creatorUid !== null && creatorPhotoURL !== null && thumbCreatorPhotoURL !== null) {

        const course = new Course();
        course.courseId = courseId;
        course.title = title;
        course.description = description;
        course.creatorName = creatorName;
        course.creatorUid = creatorUid;
        course.creatorPhotoURL = creatorPhotoURL;
        course.thumbCreatorPhotoURL = thumbCreatorPhotoURL;

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

  public deleteCourseTitleImage(authUid: string, courseId: string, fileName: any): Promise<void> {
    return this.fireStore.ref(`profiles/${authUid}/courses/${courseId}/${fileName}`).delete() &&
      this.fireStore.ref(`profiles/${authUid}/courses/${courseId}/thumb_${fileName}`).delete() as Promise<void>;
  }

  private createCourseUploadSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Kurs wurde erfolgreich hochgeladen.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

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
  public chooseAndUploadContentVideo(courseId: string, contentId: string, title: string, description: string): Promise<void> {
    return this.fileChooser.open().then((url) => {
      (<any>window).FilePath.resolveNativePath(url, (result) => {
        let nativePath: any;
        nativePath = result;
        this.uploadContentVideo(nativePath, courseId, contentId, title, description);
      });
    }) as Promise<void>;
  }

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
          let partsOfUrl = nativePath.split('/');
          let fileName = partsOfUrl.pop() || partsOfUrl.pop();

          // get file type
          let getFileType = nativePath.split('.');
          let fileType = getFileType.pop() || getFileType.pop();

          if (fileType !== ('mp4' || 'MP4')) {
            this.loading.dismiss();
            alert('Die Datei ist nicht vom Typ mp4. Content wurde nicht erstellt. Versuchen Sie es erneuert.');
          } else {
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
          }
        }
      });
    });
  }

  private setContentOrUpdateVideoIdURLAndName(authUid: string, fileName: string, courseId: string, contentId: string, title: string, description: string) {
    this.fireStore.ref(`profiles/${authUid}/contents/${courseId}/${contentId}/${fileName}`).getDownloadURL().then(async (url) => {
      if (title !== null && description !== null) {
        // validate Data
        if (courseId === null || contentId === null) {
          return Promise.reject(new Error('KursId und ContentId dürfen nicht null sein.'));
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

  public deleteContentVideo(authUid: string, courseId: string, contentId: string, fileName: any): Promise<void> {
    return this.fireStore.ref(`profiles/${authUid}/contents/${courseId}/${contentId}/${fileName}`).delete() as Promise<void>;
  }

  private createContentUploadSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Content wurde erfolgreich hochgeladen.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

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
  private getProfileSubscription(uid: string): Promise<Profile> {
    return new Promise(resolve => {
      this.SubscriptionGetProfile = this.afDb.object(`profiles/${uid}`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  // Profile Service Method.
  private unsubscribeGetProfileSubscription() {
    this.SubscriptionGetProfile.unsubscribe();
  }

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
    return this.afDb.object(`/photos/${authUid}/${photoId}`).remove() as Promise<void>;
  }

  // Course Services
  // Course Service Method.
  private getCoursesSubscription(): Promise<Course[]> {
    return new Promise(resolve => {
      this.SubscriptionGetCourses = this.afDb.list(`/courses/`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  // Course Service Method.
  private unsubscribeGetCoursesSubscription() {
    this.SubscriptionGetCourses.unsubscribe();
  }

  // Course Service Method.
  public getCourseSubscription(courseId: string): Promise<Course> {
    return new Promise(resolve => {
      this.SubscriptionGetCourse = this.afDb.object(`/courses/${courseId}`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  // Course Service Method.
  public unsubscribeGetCourseSubscription() {
    this.SubscriptionGetCourse.unsubscribe();
  }

  // Course Services
  // Course Service Method.
  public getContentSubscription(courseId: string, contentId: string): Promise<Content> {
    return new Promise(resolve => {
      this.SubscriptionGetContent = this.afDb.object(`/contents/${courseId}/${contentId}`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  public unsubscribeGetContentSubscription() {
    this.SubscriptionGetContent.unsubscribe();
  }

}
