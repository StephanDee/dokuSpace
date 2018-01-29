import { Injectable } from '@angular/core';

import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase } from 'angularfire2/database-deprecated';
import { Observable } from 'rxjs/Observable';
import { User } from 'firebase';
import { BasePage } from '../pages/base/base';

/**
 * This class represents the Authentication Service.
 *
 * @author Stephan Dünkel
 * @copyright dokuSpace 2018
 */
@Injectable()
export class AuthService {

  /**
   * The Constructor of Auth Service.
   *
   * @param {AngularFireAuth} afAuth The AngularFire Authentication
   * @param {AngularFireDatabase} afDb The AngularFire Database
   */
  constructor(private afAuth: AngularFireAuth,
              private afDb: AngularFireDatabase) {
  }

  /**
   * Gets the Auth State.
   *
   * @returns {Observable<firebase.User>}
   */
  public getAuthState(): Observable<User> {
    return this.afAuth.authState as Observable<User>;
  }

  /**
   * Gets the Auth User ID.
   *
   * @returns {string}
   */
  public getAuthUid(): string {
    return this.afAuth.auth.currentUser.uid as string;
  }

  /**
   * Update the Email Address of the authenticated User.
   *
   * @param {string} email The Email Address
   * @returns {Promise<void>}
   */
  public updateAuthEmail(email: string): Promise<void> {
    if (!email.match(BasePage.REGEX_EMAIL)) {
      return Promise.reject(new Error('Es wurde keine E Mail Adresse eingeben.'));
    }
    return this.afAuth.auth.currentUser.updateEmail(email) as Promise<void>;
  }

  /**
   * Login.
   *
   * @param {string} email The Email Address
   * @param {string} password The Passwort
   * @returns {Promise<any>}
   */
  public login(email: string, password: string): Promise<any> {
    if (!email.match(BasePage.REGEX_EMAIL)) {
      return Promise.reject(new Error('Es wurde keine E Mail Adresse eingeben.'));
    }
    if (password.length < 6) {
      return Promise.reject(new Error('Das Passwort muss mind. 6 Zeichen enthalten.'));
    }

    return this.afAuth.auth.signInWithEmailAndPassword(email, password).then(async (user) => {
      // if (!user.emailVerified) {
      // await this.logout();
      //   return Promise.reject('Bevor Sie sich einloggen, bestätigen Sie die Verifizierung in der Email.');
      // }

      // get uid to be able to check if user exists in database profile reference.
      return this.afDb.object(`/profiles/${user.uid}`);
    }) as Promise<any>;
  }

  /**
   * Registration.
   *
   * @param {string} email The Email Address
   * @param {string} password The Password
   * @returns {Promise<any>}
   */
  public register(email: string, password: string): Promise<any> {
    if (!email.match(BasePage.REGEX_EMAIL)) {
      return Promise.reject(new Error('Es wurde keine E Mail Adresse eingeben.'));
    }
    if (password.length < 6) {
      return Promise.reject(new Error('Das Passwort muss mind. 6 Zeichen enthalten.'));
    }

    return this.afAuth.auth.createUserWithEmailAndPassword(email, password).then(async (user) => {
      await user.sendEmailVerification();
      // get uid to be able to check if registered user exists in database profile reference.
      return this.afDb.object(`/profiles/${user.uid}`);
    }) as Promise<any>;
  }

  /**
   * Logout.
   *
   * @returns {Promise<void>}
   */
  public logout(): Promise<void> {
    return this.afAuth.auth.signOut() as Promise<void>;
  }

  // ONLY FOR TEST PURPOSES, DO NOT USE THIS METHOD IN PRODUCTION
  /**
   * Gets the current User.
   *
   * @returns {firebase.User | null}
   */
  public getCurrentUser() {
    return this.afAuth.auth.currentUser;
  }

  // ONLY FOR TEST PURPOSES, DO NOT USE THIS METHOD IN PRODUCTION
  /**
   * Gets the authenticated User Email.
   *
   * @returns {string | null}
   */
  public getAuthEmail() {
    return this.afAuth.auth.currentUser.email;
  }

}
