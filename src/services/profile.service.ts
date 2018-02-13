import { Injectable } from '@angular/core';
import {
  AngularFireDatabase, FirebaseListObservable,
  FirebaseObjectObservable
} from 'angularfire2/database-deprecated';
import { Profile, Role } from '../models/profile';
import { File } from '../models/file';
import { Subscription } from 'rxjs/Subscription';
import { BasePage } from '../pages/base/base';

/**
 * This class represents the Profile Service.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Injectable()
export class ProfileService {

  private getProfileSubSubscription: Subscription;

  /**
   * The Constructor of Profile Service.
   *
   * @param {AngularFireDatabase} afDb The AngularFire Database
   */
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

  /**
   * Get Profile Information to display on the HTML.
   *
   * @returns {FirebaseListObservable<Profile>}
   */
  public getProfiles(): FirebaseListObservable<Profile> {
    return this.afDb.list(`/profiles`) as FirebaseListObservable<any>;
  }

  /**
   * This method unsubscribe the getProfileSubscription().
   */
  public unsubscribeGetProfileSubscription() {
    this.getProfileSubSubscription.unsubscribe();
  }

  /**
   * Set a new Profile Name.
   *
   * @param {string} uid The authenticated User ID
   * @param {string} userName The User Name
   * @returns {Promise<void>}
   */
  public setProfileName(uid: string, userName: string): Promise<void> {
    if (uid === null) {
      return Promise.reject(new Error('User ID darf nicht null sein.'));
    }
    if (userName.length < 1 || userName.length > 25 || !userName.match(BasePage.REGEX_START_NOBLANK)) {
      return Promise.reject(new Error('Name muss mind. 1 und max. 25 Zeichen lang und nicht leer sein.'));
    }
    return this.afDb.object(`/profiles/${uid}/name`).set(userName) as Promise<void>;
  }

  /**
   * Set Profile Email.
   *
   * @param {string} uid The authenticated User ID
   * @param {string} userEmail The Email
   * @returns {Promise<void>}
   */
  public setProfileEmail(uid: string, userEmail: string): Promise<void> {
    if (uid === null) {
      return Promise.reject(new Error('User ID darf nicht null sein.'));
    }
    if (!userEmail.match(BasePage.REGEX_EMAIL)) {
      return Promise.reject(new Error('Es wurde keine E Mail Adresse eingeben.'));
    }
    return this.afDb.object(`/profiles/${uid}/email`).set(userEmail) as Promise<void>;
  }

  /**
   * Set Profile Email Verified.
   *
   * @param {string} uid The authenticated User ID
   * @param {boolean} userEmailVerified The Email Verification
   * @returns {Promise<void>}
   */
  public setProfileEmailVerified(uid: string, userEmailVerified: boolean): Promise<void> {
    if (uid === null || userEmailVerified === null) {
      return Promise.reject(new Error('User ID darf nicht null sein.'));
    }
    return this.afDb.object(`profiles/${uid}/emailVerified`).set(userEmailVerified) as Promise<void>;
  }

  /**
   * Set Profile Role, only SuperAdmin can set.
   *
   * @param {string} uid The authenticated User ID
   * @param {string} userRole The Role of a User
   * @returns {Promise<void>}
   */
  public setProfileRole(uid: string, userRole: string): Promise<void> {
    if (uid === null) {
      return Promise.reject(new Error('User ID darf nicht null sein.'));
    }
    if (userRole !== Role.STUDENT && userRole !== Role.TEACHER) {
      return Promise.reject(new Error('Es gibt nur die Rolle Student und Teacher.'));
    }
    return this.afDb.object(`/profiles/${uid}/role`).set(userRole) as Promise<void>;
  }

  /**
   * Updates Profile Photo Url to Default.
   * Used this method only when photoURL is set to default -> photoURL === thumbPhotoURL.
   *
   * @param {string} uid The authenticated User ID
   * @returns {Promise<void>}
   */
  public updateProfilePhotoURLToDefault(uid: string): Promise<void> {
    const photoURL = Profile.DEFAULT_PHOTOURL;

    if (uid === null) {
      return Promise.reject(new Error('User ID darf nicht null sein.'));
    }
    return this.afDb.object(`/profiles/${uid}`).update({photoURL: photoURL, thumbPhotoURL: photoURL}) as Promise<void>;
  }

  /**
   * Deletes the Profile Photo ID.
   *
   * @param {string} uid The authenticated User ID
   * @returns {Promise<void>}
   */
  public deleteProfilePhotoId(uid: string): Promise<void> {
    if (uid === null) {
      return Promise.reject(new Error('User ID darf nicht null sein.'));
    }
    return this.afDb.object(`/profiles/${uid}/photoId`).remove() as Promise<void>;
  }

  /**
   * Deletes the Profile Photo Name.
   *
   * @param {string} uid The authenticated User ID
   * @returns {Promise<void>}
   */
  public deleteProfilePhotoName(uid: string): Promise<void> {
    if (uid === null) {
      return Promise.reject(new Error('User ID darf nicht null sein.'));
    }
    return this.afDb.object(`/profiles/${uid}/photoName`).remove() as Promise<void>;
  }

  // not used here. @injectable file.service.ts uses these methods.
  /**
   * Set Profile Photo Name.
   *
   * @param {string} uid The authencicated User ID
   * @param {string} userPhotoName The Photo Name
   * @returns {Promise<void>}
   */
  public setProfilePhotoName(uid: string, userPhotoName: string): Promise<void> {
    if (uid === null) {
      return Promise.reject(new Error('User ID darf nicht null sein.'));
    }
    if (!userPhotoName.includes('.jpg' || '.JPG' || '.jpeg' || '.JPEG' || '.png' || '.PNG')) {
      return Promise.reject(new Error('Daten dürfen nur im jpg/jpeg oder png Format hochgeladen werden.'));
    }
    return this.afDb.object(`/profiles/${uid}/photoName`).set(userPhotoName) as Promise<void>;
  }

  // ONLY FOR TEST PURPOSES, DO NOT USE THIS METHOD IN PRODUCTION
  public setProfilePhotoURL(uid: string, userPhotoURL: string): Promise<void> {
    if (uid === null) {
      return Promise.reject(new Error('User ID darf nicht null sein.'));
    }
    if (!userPhotoURL.includes(File.DEFAULT_FILE_URL) && !userPhotoURL.includes(File.DEFAULT_FILE_URL_DIRECT)) {
      return Promise.reject(new Error('Daten dürfen nur auf die dokuSpace Cloud hochgeladen werden.'));
    }
    return this.afDb.object(`/profiles/${uid}/photoURL`).set(userPhotoURL) as Promise<void>;
  }

  // ONLY FOR TEST PURPOSES, DO NOT USE THIS METHOD IN PRODUCTION
  public deleteProfileNameTESTONLY(uid: string): Promise<void> {
    if (uid === null) {
      return Promise.reject(new Error('User ID darf nicht null sein.'));
    }
    return this.afDb.object(`/profiles/${uid}/name`).set(null) as Promise<void>;
  }

}
