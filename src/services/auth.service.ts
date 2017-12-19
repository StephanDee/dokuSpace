import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from '../models/profile';
import { AngularFireDatabase } from "angularfire2/database-deprecated";

@Injectable()
export class AuthService {

  constructor(protected afAuth: AngularFireAuth,
              protected afDb: AngularFireDatabase) {
  }

  public login(email: string, password: string): Promise<Profile> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then(async (user) => {
      // if (!user.emailVerified) {
      //   await this.afAuth.auth.signOut();
      //   return Promise.reject('Bevor Sie sich einloggen, bestätigen Sie die Verifizierung in der Email.');
      // }

      return this.afDb.object(`/profiles/${user.uid}`).first().toPromise();
    }) as Promise<any>;
  }

  public logout(): Promise<void> {
    return this.afAuth.auth.signOut() as Promise<void>;
  }

}
