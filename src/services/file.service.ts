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

        reader.onloadend = (event: any) => {

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
              this.getProfileSubscription(authUid).then(async (data) => {
                let photoId = data.photoId;
                let photoName = data.photoName;
                let currentPhotoURL = data.photoURL;

                this.setPhotoIdURLAndName(authUid, fileName, photoId, photoName, currentPhotoURL);
              }).catch((err) => {
                alert('Ein Fehler ist Aufgetreten: ' + err);
                console.log(err);
              });
              this.unsubscribeGetProfileSubscription();

              this.profileImageUploadSuccessToast();
              this.loading.dismiss();
            }).catch((err) => {
              this.loading.dismiss();
              alert('Upload Failed: ' + err);
            });
          }
        }
      });
    });
  }

  private setPhotoIdURLAndName(authUid: string, fileName: string, photoId: string, photoName: string, currentPhotoURL: string) {
    this.fireStore.ref(`profiles/${authUid}/photo/${fileName}`).getDownloadURL().then(async (url) => {
      if (photoId === undefined || photoName !== fileName) {
        photoId = this.afDb.list(`/profiles/${authUid}`).push({}).key;
      }

      // update creatorPhotoURL for courses, when user updated photoURL
      await this.getCoursesSubscription().then(async (data) => {
        for (let ids of data) {
          const courseId = ids.courseId;
          const creatorPhotoURL = ids.creatorPhotoURL;
          if (creatorPhotoURL === currentPhotoURL) {
            this.setProfilePhotoURL(courseId, url);
          }
        }
        await this.unsubscribeGetCoursesSubscription();
      });

      // Profile Services
      await this.afDb.object(`/profiles/${authUid}/photoId`).set(photoId);
      await this.afDb.object(`/profiles/${authUid}/photoURL`).set(url);
      await this.afDb.object(`/profiles/${authUid}/photoName`).set(fileName);

      // Creates a new Photo
      const photo = new Photo();
      photo.photoId = photoId;
      photo.photoName = fileName;
      photo.photoURL = url;

      // Photo Services
      this.afDb.object(`/photos/${authUid}/${photoId}`).set(photo);

    }).catch((err) => {
      alert('Ein Fehler ist aufgetregten: ' + err);
      console.log(err);
    });
  }

  public deleteProfileImage(authUid: string, fileName: any): Promise<void> {
    return this.fireStore.ref(`profiles/${authUid}/photo/${fileName}`).delete() as Promise<void>;
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
  public chooseAndUploadCourseTitleImage(courseId: string, title: string, description: string, creatorName: string, creatorUid: string, creatorPhotoURL: string): Promise<void> {
    return this.fileChooser.open().then((url) => {
      (<any>window).FilePath.resolveNativePath(url, (result) => {
        let nativePath: any;
        nativePath = result;
        this.uploadCourseTitleImage(nativePath, courseId, title, description, creatorName, creatorUid, creatorPhotoURL);
      });
    }) as Promise<void>;
  }

  private uploadCourseTitleImage(nativePath: any, courseId: string, title: string, description: string, creatorName: string, creatorUid: string, creatorPhotoURL: string) {
    this.createLoading('Der Kurs wird hochgeladen hochgeladen...');
    (<any>window).resolveLocalFileSystemURL(nativePath, (res) => {
      res.file((resFile) => {
        this.loading.present();
        // Initialize FileReader
        let reader = new FileReader();
        reader.readAsArrayBuffer(resFile);

        reader.onloadend = (event: any) => {

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

              this.setTitleImageIdURLAndName(authUid, fileName, courseId, title, description, creatorName, creatorUid, creatorPhotoURL);

              this.profileImageUploadSuccessToast();

              this.loading.dismiss();
            }).catch((err) => {
              this.loading.dismiss();
              alert('Upload Failed: ' + err);
            });
          }
        }
      });
    });
  }

  private setTitleImageIdURLAndName(authUid: string, fileName: string, courseId: string, title: string, description: string, creatorName: string, creatorUid: string, creatorPhotoURL: string) {
    this.fireStore.ref(`profiles/${authUid}/courses/${courseId}/${fileName}`).getDownloadURL().then(async (url) => {
      const titleImageId = this.afDb.list(`/courses`).push({}).key;
      const course = new Course();
      course.courseId = courseId;
      course.title = title;
      course.description = description;
      course.creatorName = creatorName;
      course.creatorUid = creatorUid;
      course.creatorPhotoURL = creatorPhotoURL;
      course.titleImageId = titleImageId;
      course.titleImageName = fileName;
      course.titleImageUrl = url;

      // Courses Services
      await this.afDb.object(`/courses/${courseId}`).set(course);
    }).catch((err) => {
      alert('Ein Fehler ist aufgetregten: ' + err);
      console.log(err);
    });
  }

  public deleteCourseTitleImage(authUid: string, fileName: any): Promise<void> {
    return this.fireStore.ref(`courses/${authUid}/titleImage/${fileName}`).delete() as Promise<void>;
  }

  // End: File Upload for Course Title Image

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
  private setProfilePhotoURL(courseId: string, creatorPhotoURL: string): Promise<void> {
    return this.afDb.object(`/courses/${courseId}/creatorPhotoURL`).set(creatorPhotoURL) as Promise<void>;
  }

}
