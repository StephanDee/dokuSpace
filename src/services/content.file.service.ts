import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { FileChooser } from '@ionic-native/file-chooser';
import { AlertController, LoadingController, NavController, ToastController } from 'ionic-angular';
import { BasePage } from '../pages/base/base';
import { AuthService } from "./auth.service";
import { ContentService } from "./content.service";

/**
 * This class represents the Content File Service.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Injectable()
export class ContentFileService extends BasePage {

  // Attributes
  private fireStore = firebase.storage();

  /**
   * The Constructor of Content File Service.
   * All Services used here, must be set as Providers in the using classes.
   *
   * @param {NavController} navCtrl The Navigation Controller
   * @param {AlertController} alertCtrl The Alert Controller
   * @param {LoadingController} loadingCtrl The Loading Controller
   * @param {ToastController} toastCtrl The Toast Controller
   * @param {AuthService} authService The AuthService, provides Methods for the authenticated User
   * @param {ContentService} contentService The ContentService, provides Methods for the Contents
   * @param {FileChooser} fileChooser The File Chooser, imported ionic Module
   */
  constructor(public navCtrl: NavController,
              public alertCtrl: AlertController,
              public loadingCtrl: LoadingController,
              private toastCtrl: ToastController,
              private authService: AuthService,
              private contentService: ContentService,
              private fileChooser: FileChooser) {
    super(navCtrl, alertCtrl, loadingCtrl);
  }

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
            let authUid = this.authService.getAuthUid();
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

        await this.contentService.createContent(authUid, courseId, contentId, title, description, fileName, url);
      } else {
        this.contentService.getContentSubscription(courseId, contentId).then((data) => {
          let currentVideoName = data.videoName;

          if (fileName !== currentVideoName) {
            this.deleteContentVideo(authUid, courseId, contentId, currentVideoName);
          }
        });
        await this.contentService.unsubscribeGetContentSubscription();

        await this.contentService.updateContentVideoNameAndUrl(courseId, contentId, url, fileName);
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

}
