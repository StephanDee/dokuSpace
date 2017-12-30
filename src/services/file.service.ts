import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import * as firebase from "firebase";
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { FileChooser } from '@ionic-native/file-chooser';
import { LoadingController, ToastController } from "ionic-angular";

@Injectable()
export class FileService {

  // Attributes
  private fireStore = firebase.storage();
  private loading: any;

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

          let imgBlob = new Blob([event.target.result], {type: 'image/jpeg'});
          let imageStore = this.fireStore.ref().child(`profiles/${authUid}/photo/${fileName}`);

          imageStore.put(imgBlob).then((res) => {
            this.setPhotoURLAndName(authUid, fileName);
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

  private setPhotoURLAndName(authUid: string, fileName: string) {
    this.fireStore.ref(`profiles/${authUid}/photo/${fileName}`).getDownloadURL().then((url) => {
      this.afDb.object(`/profiles/${authUid}/photoURL`).set(url);
      this.afDb.object(`/profiles/${authUid}/photoName`).set(fileName);
    });
  }

  public deleteProfileImage(authUid: string, fileName: any): Promise<void> {
    return this.fireStore.ref(`profiles/${authUid}/photo/${fileName}`).delete() as Promise<void>;
  }

  protected profileImageUploadSuccessToast() {
    let toast = this.toastCtrl.create({
      message: 'Profilbild wurde erfolgreich hochgeladen.',
      showCloseButton: true,
      closeButtonText: 'Ok'
    });
    toast.present();
  }

}
