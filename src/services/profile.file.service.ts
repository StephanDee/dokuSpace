import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { FileChooser } from '@ionic-native/file-chooser';
import { AlertController, LoadingController, NavController, ToastController } from 'ionic-angular';
import { BasePage } from '../pages/base/base';
import { AuthService } from './auth.service';
import { PhotoService } from './photo.service';

/**
 * This class represents the Profile File Service.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Injectable()
export class ProfileFileService extends BasePage {

  // Attributes
  private fireStore = firebase.storage();

  /**
   * The Constructor of Profile File Service.
   * All Services used here, must be set as Providers in the using classes.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {ToastController} toastCtrl The Toast Controller
   * @param {AuthService} authService The AuthService, provides Methods for the authenticated User
   * @param {photoService} photoService The PhotoService, provides Methods for the Photos
   * @param {FileChooser} fileChooser The File Chooser, imported ionic Module
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private authService: AuthService,
              private photoService: PhotoService,
              private fileChooser: FileChooser) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

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
            let authUid = this.authService.getAuthUid();
            let imgBlob;

            // if photoName already used, delete PhotoEntry from Database and File from Storage.
            // File will be automatically overwritten in Storage, but the Cloud Function laggs executing
            // if File already exist
            await this.photoService.getPhotoSubscription(authUid).then(async (data) => {
              for (let ids of data) {
                const photoId = ids.photoId;
                const photoName = ids.photoName;
                if (photoName === fileName) {
                  // alert('Photo to delete: ' + photoName);
                  this.photoService.deleteProfilePhoto(authUid, photoId);

                  // should not be needed like in the other uploaders,
                  // but somehow it reduces the lag of uploading the new File
                  this.deleteProfileImage(authUid, fileName);
                }
              }
              await this.photoService.unsubscribeGetPhotoSubscription();
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

}
