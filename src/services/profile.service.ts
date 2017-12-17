import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';
import { Subscription } from 'rxjs/Subscription';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Profile } from '../models/profile';
import { Observable } from "rxjs/Observable";

@Injectable()
export class ProfileService {

  // protected userSubcription: Subscription;
  protected profileData: FirebaseObjectObservable<Profile>;

  constructor(protected afAuth: AngularFireAuth,
              protected afDb: AngularFireDatabase) {

  }

  public getUserProfile(): FirebaseObjectObservable<Profile> {
    this.afAuth.authState.subscribe(data => {
      if (data && data.email && data.uid) {
       this.profileData = this.afDb.object(`profiles/${data.uid}`) as FirebaseObjectObservable<Profile>;
       console.log(this.profileData);
      }
    });
    return;
  }

  public updateUserProfileName(name: string): Promise<void> {
    return this.profileData.update(name);
  }

}
