import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { BasePage } from '../base/base';
import { AngularFireAuth } from 'angularfire2/auth';
import { Profile } from '../../models/profile';
import { AngularFireDatabase, FirebaseObjectObservable } from "angularfire2/database-deprecated";

@Component({
  selector: 'page-profile-tab',
  templateUrl: 'profile-tab.html'
})
export class ProfileTabPage extends BasePage {

  protected profileData: FirebaseObjectObservable<Profile>;

  constructor(public navCtrl: NavController,
              private afAuth: AngularFireAuth,
              private afDb: AngularFireDatabase) {
    super(navCtrl);
  }

  async ngOnInit(){
    this.afAuth.authState.take(1).subscribe(data => {
      if (data && data.email && data.uid){
        this.profileData = this.afDb.object(`profiles/${data.uid}`);
      }
    });
  }
}
