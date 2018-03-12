import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { DEBUG_MODE } from '../../shared/constants';
import { NavbarComponent } from '../../components/navbar';

@IonicPage()
@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html',
})
export class NotificationsPage {

  public pageTitle: string;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    if (DEBUG_MODE) console.log('NotificationsPage.constructor()');

  }

  refreshData(refresher) {
    setTimeout(() => {
      if (DEBUG_MODE) console.log('NotificationsPage.refreshData()');
      this.getNotifications();
      refresher.complete();
    }, 500);
  }

  getNotifications() {
    if (DEBUG_MODE) console.log('NotificationsPage.getNotifications()');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationsPage');
  }

}
