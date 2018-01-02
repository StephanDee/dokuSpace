import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import * as firebase from "firebase";
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { FileChooser } from '@ionic-native/file-chooser';
import { LoadingController, ToastController } from "ionic-angular";
import { Profile } from "../models/profile";
import { Subscription } from "rxjs/Subscription";
import { Photo } from "../models/photo";

@Injectable()
export class FileService {

  // Attributes
  private fireStore = firebase.storage();
  private loading: any;

  // Profile Service Attribute
  private SubscriptionGetProfile: Subscription;

  // Photo Service Attribute
  private SubscriptionGetPhoto: Subscription;

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

  private getAuthUid(): string {
    return this.afAuth.auth.currentUser.uid as string;
  }

  public chooseAndUploadProfileImage(): Promise<void> {
    return this.fileChooser.open().then((url) => {
      (<any>window).FilePath.resolveNativePath(url, (result) => {
        let nativePath: any;
        nativePath = result;
        this.uploadImage(nativePath);
      });
    }) as Promise<void>;
  }

  private uploadImage(nativePath: any) {
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
          let authUid = this.getAuthUid();

          // if photoName already used, delete PhotoEntry from Database. File will be automatically overwritten.
          this.getPhotoSubscription(authUid).then(async (data) => {
            for (let ids of data) {
              const photoId = ids.photoId;
              const photoName = ids.photoName;
              if (photoName === fileName) {
                alert('Photo to delete: ' + photoName);
                this.deleteProfilePhoto(authUid, photoId);
              }
            }
            await this.unsubscribeGetPhotoSubscription();
          });


          let imgBlob = new Blob([event.target.result], {type: 'image/jpeg'});
          let imageStore = this.fireStore.ref().child(`profiles/${authUid}/photo/${fileName}`);

          imageStore.put(imgBlob).then((res) => {
            this.getProfileSubscription(authUid).then((data) => {
              let photoId = data.photoId;
              let photoName = data.photoName;

              this.setPhotoIdURLAndName(authUid, fileName, photoId, photoName);
            });
            this.unsubscribeGetProfileSubscription();

            this.profileImageUploadSuccessToast();
            this.loading.dismiss();
          }).catch((err) => {
            this.loading.dismiss();
            alert('Upload Failed: ' + err);
          });
        }
      });
    });
  }

  private setPhotoIdURLAndName(authUid: string, fileName: string, photoId: string, photoName: string) {
    this.fireStore.ref(`profiles/${authUid}/photo/${fileName}`).getDownloadURL().then((url) => {
      if (photoId === undefined || photoName !== fileName) {
        photoId = this.afDb.list(`/profiles/${authUid}`).push({}).key;
      }

      // Profile Services
      this.afDb.object(`/profiles/${authUid}/photoId`).set(photoId);
      this.afDb.object(`/profiles/${authUid}/photoURL`).set(url);
      this.afDb.object(`/profiles/${authUid}/photoName`).set(fileName);

      this.setListPhotoIdURLAndName(authUid, fileName, photoId);
    });
  }

  private setListPhotoIdURLAndName(authUid: string, fileName: string, photoId: string) {
    this.fireStore.ref(`profiles/${authUid}/photo/${fileName}`).getDownloadURL().then((url) => {

      // Photo Services
      this.afDb.object(`/photos/${authUid}/${photoId}/photoId`).set(photoId);
      this.afDb.object(`/photos/${authUid}/${photoId}/photoURL`).set(url);
      this.afDb.object(`/photos/${authUid}/${photoId}/photoName`).set(fileName);
    });
  }

  public deleteProfileImage(authUid: string, fileName: any): Promise<void> {
    return this.fireStore.ref(`profiles/${authUid}/photo/${fileName}`).delete() as Promise<void>;
  }

  // @Injectable can't use other @Injectables classes. Following Methods are from other Services.

  // Profile Services
  // Profile Service Method.
  private profileImageUploadSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Profilbild wurde erfolgreich hochgeladen.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

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

}
