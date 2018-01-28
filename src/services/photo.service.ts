import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';

/**
 * This class represents the Photo Service.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Injectable()
export class PhotoService {

  /**
   * The Constructor of Photo Service.
   *
   * @param {AngularFireDatabase} afDb The AngularFire Database.
   */
  constructor(private afDb: AngularFireDatabase) {
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
      return Promise.reject(new Error('authUid und photoId darf nicht null sein.'));
    }
    return this.afDb.object(`/photos/${authUid}/${photoId}`).remove() as Promise<void>;
  }
}
