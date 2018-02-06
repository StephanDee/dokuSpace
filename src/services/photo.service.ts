import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Photo } from '../models/photo';
import { Subscription } from "rxjs/Subscription";

/**
 * This class represents the Photo Service.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Injectable()
export class PhotoService {

  // Attributes
  private SubscriptionGetPhoto: Subscription;

  /**
   * The Constructor of Photo Service.
   *
   * @param {AngularFireDatabase} afDb The AngularFire Database.
   */
  constructor(private afDb: AngularFireDatabase) {
  }

  /**
   * Get Photo Subscription to get access to Course data to work with.
   * Do not forget to unsubscribe with unsubscribeGetPhotoSubscription() method.
   *
   * @param {string} uid The User ID
   * @returns {Promise<Photo[]>}
   */
  public getPhotoSubscription(uid: string): Promise<Photo[]> {
    return new Promise(resolve => {
      this.SubscriptionGetPhoto = this.afDb.list(`photos/${uid}`).subscribe((data) => {
        resolve(data);
      });
    });
  }

  /**
   * Unsubscribe Photo.
   */
  public unsubscribeGetPhotoSubscription() {
    this.SubscriptionGetPhoto.unsubscribe();
  }

  /**
   * Deletes a Profile Photo.
   *
   * @param {string} authUid The AuthUid
   * @param {string} photoId The Photo ID
   * @returns {Promise<void>}
   */
  public deleteProfilePhoto(authUid: string, photoId: string): Promise<void> {
    if (authUid === null || photoId === null) {
      return Promise.reject(new Error('User ID und Photo ID darf nicht null sein.'));
    }
    return this.afDb.object(`/photos/${authUid}/${photoId}`).remove() as Promise<void>;
  }
}
