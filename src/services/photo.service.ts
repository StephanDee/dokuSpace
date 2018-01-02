import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';

@Injectable()
export class PhotoService {

  /**
   *
   * @param {AngularFireDatabase} afDb
   */
  constructor(private afDb: AngularFireDatabase) {
  }

  public deleteProfilePhoto(authUid: string, photoId: string): Promise<void> {
    return this.afDb.object(`/photos/${authUid}/${photoId}`).remove() as Promise<void>;
  }
}
