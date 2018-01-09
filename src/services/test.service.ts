import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database-deprecated";


@Injectable()
export class TestService {

  constructor(private afDb: AngularFireDatabase) {
  }

  // test example karma + jasmine
  public add(a, b) {
    return a + b;
  }

  public getTestSubscription(): Promise<any> {
    return new Promise(resolve => {
      this.afDb.object(`/test`).subscribe((data) => {
        resolve(data);
      });
    });
  }


}
