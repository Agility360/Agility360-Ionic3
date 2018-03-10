import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DEBUG_MODE } from '../../shared/constants';
import { Candidate } from '../../shared/candidate';
import { CandidateProvider } from '../../providers/candidate';
import { ProfileEditPage } from '../agility-profile-edit/profile-edit';
import { NavbarComponent } from '../../components/navbar';

/**
 * Generated class for the ProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {

  card: Candidate;
  errMess: string;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private provider: CandidateProvider) {

    if (DEBUG_MODE) console.log('ProfilePage.constructor()');
    this.get();

  }

  ionViewWillEnter() {
    if (DEBUG_MODE) console.log('ProfilePage.ionViewWillEnter()');
  }

  refresh(refresher) {
    setTimeout(() => {
      if (DEBUG_MODE) console.log('ProfilePage.refresh()');
      this.get();
      refresher.complete();
    }, 500);
  }


  get() {
    if (DEBUG_MODE) console.log('ProfilePage.get()');
    this.provider.get()
      .subscribe(
      result => {
        this.card = result
        if (DEBUG_MODE) console.log('ProfilePage.get() - got: ', this.card);
      },
      err => {
        this.errMess = <any>err
        if (DEBUG_MODE) console.log('ProfilePage.get() - error: ', this.errMess);
      });
  }


  edit(event, candidate: Candidate) {
    if (DEBUG_MODE) console.log('ProfilePage.edit() - button clicked:', candidate);
    this.navCtrl.push(ProfileEditPage, {
      obj: candidate,
      action: 'Edit'
    });
  } /* edit() */


}
