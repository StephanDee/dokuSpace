import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Profile } from '../models/profile';
import { Observable } from "rxjs/Observable";

@Injectable()
export class ProfileService {

  constructor(protected afDb: AngularFireDatabase) {
  }

  public getProfile(uid: string): Observable<Profile> {
    return this.afDb.object(`/profiles/${uid}`);
  }

  public updateUserProfile(profile: Profile): Promise<void> {
    return this.afDb.object(`/profiles/${profile.name}`).update(profile) as Promise<void>;
  }

}
