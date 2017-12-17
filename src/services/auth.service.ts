import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from '../models/profile';

@Injectable()
export class AuthService {

  constructor(protected afAuth: AngularFireAuth) {
  }

  public login(email: string, password: string): Promise<void> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then(async (user) => {
      if (!user.emailVerified) {
        await this.afAuth.auth.signOut();
        return Promise.reject('Please verify your email.');
      }
    });
  }

  public logout(): Promise<void> {
    return this.afAuth.auth.signOut() as Promise<void>;
  }

}
