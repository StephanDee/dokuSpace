import 'rxjs/add/operator/first';
import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from 'angularfire2/database-deprecated';
import { Profile } from '../models/profile';

@Injectable()
export class ProfileService {

  constructor(private afDb: AngularFireDatabase) {
  }

  public getProfile(uid: string): FirebaseObjectObservable<Profile> {
    return this.afDb.object(`/profiles/${uid}`) as FirebaseObjectObservable<Profile>;
  }

  public getProfilePhotoName(uid: string): FirebaseObjectObservable<any> {
    return this.afDb.object(`profiles/${uid}/photoName`) as FirebaseObjectObservable<any>;
  }

  public setProfileName(uid: string, userName: string): Promise<void> {
    return this.afDb.object(`/profiles/${uid}/name`).set(userName) as Promise<void>;
  }

  public setProfileEmail(uid: string, userEmail: string): Promise<void> {
    return this.afDb.object(`/profiles/${uid}/email`).set(userEmail) as Promise<void>;
  }

  public setProfilePhotoName(uid: string, userPhotoImageName: string): Promise<void> {
    return this.afDb.object(`/profiles/${uid}/photoURL`).set(userPhotoImageName) as Promise<void>;
  }

  public setProfilePhotoURL(uid: string, userPhotoURL: string): Promise<void> {
    return this.afDb.object(`/profiles/${uid}/photoURL`).set(userPhotoURL) as Promise<void>;
  }

  public setProfileRole(uid: string, userRole: string): Promise<void> {
    return this.afDb.object(`/profiles/${uid}/role`).set(userRole) as Promise<void>;
  }

}
