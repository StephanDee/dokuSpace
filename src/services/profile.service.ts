import { Injectable } from '@angular/core';
import {
  AngularFireDatabase, FirebaseListObservable,
  FirebaseObjectObservable
} from 'angularfire2/database-deprecated';
import { Profile } from '../models/profile';
import { File } from '../models/file';
import { Subscription } from 'rxjs/Subscription';
import { BasePage } from '../pages/base/base';

@Injectable()
export class ProfileService {

  private getProfileSubSubscription: Subscription;

  constructor(private afDb: AngularFireDatabase) {
  }

  /**
   * Get Profile to display Profile information.
   *
   * @param {string} uid The authenticated User Identity.
   * @returns {FirebaseObjectObservable<Profile>} The FirebaseObjectObservable of a Profile.
   */
  public getProfile(uid: string): FirebaseObjectObservable<Profile> {
    return this.afDb.object(`/profiles/${uid}`) as FirebaseObjectObservable<Profile>;
  }

  /**
   * Get Profile Subscription to get access to Profile data to work with.
   * Do not forget to unsubscribe with unsubscribeGetProfileSubscription() method.
   *
   * @param {string} uid The authenticated User Identity.
   * @returns {Promise<Profile>} The promised Profile.
   */
  public getProfileSubscription(uid: string): Promise<Profile> {
    return new Promise(resolve => {
      this.getProfileSubSubscription = this.afDb.object(`profiles/${uid}`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  public getProfiles(): FirebaseListObservable<Profile> {
    return this.afDb.list(`/profiles`) as FirebaseListObservable<any>;
  }

  /**
   * This method unsubscribe the getProfileSubscription(uid).
   */
  public unsubscribeGetProfileSubscription() {
    this.getProfileSubSubscription.unsubscribe();
  }

  public setProfileName(uid: string, userName: string): Promise<void> {
    if (userName.length < 1 || userName.length > 25) {
      return Promise.reject(new Error('Name muss mind. 1 und max. 25 Zeichen lang sein.'));
    }
    return this.afDb.object(`/profiles/${uid}/name`).set(userName) as Promise<void>;
  }

  public setProfileEmail(uid: string, userEmail: string): Promise<void> {
    if(!userEmail.match(BasePage.REGEX_EMAIL)) {
      return Promise.reject(new Error('Es wurde keine E Mail Adresse eingeben.'));
    }
    return this.afDb.object(`/profiles/${uid}/email`).set(userEmail) as Promise<void>;
  }

  public setProfileEmailVerified(uid: string, userEmailVerified: boolean): Promise<void> {
    return this.afDb.object(`profiles/${uid}/emailVerified`).set(userEmailVerified) as Promise<void>;
  }

  public setProfilePhotoURL(uid: string, userPhotoURL: string): Promise<void> {
    if (!userPhotoURL.includes(File.DEFAULT_FILE_URL)) {
      return Promise.reject(new Error('Daten dürfen nur auf die dokuSpace Cloud gespeichert werden.'));
    }
    return this.afDb.object(`/profiles/${uid}/photoURL`).set(userPhotoURL) as Promise<void>;
  }

  public setProfileRole(uid: string, userRole: string): Promise<void> {
    if (userRole !== Profile.ROLE_STUDENT && userRole !== Profile.ROLE_TEACHER) {
      return Promise.reject(new Error('Es gibt nur die Rolle Student und Teacher.'));
    }
    return this.afDb.object(`/profiles/${uid}/role`).set(userRole) as Promise<void>;
  }

  // not used here. @injectable file.service.ts uses these methods.
  public setProfilePhotoName(uid: string, userPhotoName: string): Promise<void> {
    return this.afDb.object(`/profiles/${uid}/photoName`).set(userPhotoName) as Promise<void>;
  }

  public deleteProfilePhotoId(uid: string): Promise<void> {
    return this.afDb.object(`/profiles/${uid}/photoId`).remove() as Promise<void>;
  }

  // app.component.spec.ts uses this test.
  public deleteProfileName(uid: string): Promise<void> {
    return this.afDb.object(`/profiles/${uid}/name`).set(null) as Promise<void>;
  }

}
