import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { DEBUG_MODE } from '../../shared/constants';
import { NavbarComponent } from '../../components/navbar';


@IonicPage()
@Component({
  selector: 'page-http-error',
  templateUrl: 'http-error.html',
})
export class HttpErrorPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if (DEBUG_MODE) console.log('HttpErrorPage.constructor()');
  }


  retryButtonClick() {
    if (DEBUG_MODE) console.log('HttpErrorPage.RetryButtonClick()');
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    if (DEBUG_MODE) console.log('HttpErrorPage.ionViewDidLoad()');
  }
}
