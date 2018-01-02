import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Profile } from '../models/profile';
import { Subscription } from 'rxjs/Subscription';

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

  /**
   * This method unsubscribe the getProfileSubscription(uid).
   */
  public unsubscribeGetProfileSubscription() {
    this.getProfileSubSubscription.unsubscribe();
  }

  public setProfileName(uid: string, userName: string): Promise<void> {
    return this.afDb.object(`/profiles/${uid}/name`).set(userName) as Promise<void>;
  }

  public setProfileEmail(uid: string, userEmail: string): Promise<void> {
    return this.afDb.object(`/profiles/${uid}/email`).set(userEmail) as Promise<void>;
  }

  public setProfilePhotoName(uid: string, userPhotoName: string): Promise<void> {
    return this.afDb.object(`/profiles/${uid}/photoName`).set(userPhotoName) as Promise<void>;
  }

  public setProfilePhotoURL(uid: string, userPhotoURL: string): Promise<void> {
    return this.afDb.object(`/profiles/${uid}/photoURL`).set(userPhotoURL) as Promise<void>;
  }

  public setProfileRole(uid: string, userRole: string): Promise<void> {
    return this.afDb.object(`/profiles/${uid}/role`).set(userRole) as Promise<void>;
  }

  public deleteProfilePhotoId(uid: string): Promise<void> {
    return this.afDb.object(`/profiles/${uid}/photoId`).remove() as Promise<void>;
  }

}
