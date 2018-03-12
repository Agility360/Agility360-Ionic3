import { Component, ViewChild } from '@angular/core';
import { Platform, NavController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { TabsPage } from '../pages/tabs/tabs';
import { UserRegistrationService }     from '../services/account-management.service';
import { Logger }     from '../services/logger.service';
import { GlobalStateService } from '../services/global-state.service';

import { WelcomePage } from '../pages/welcome/welcome';
import { DEBUG_MODE } from '../shared/constants';

@Component({
  template: `<ion-nav #myNav [root]="rootPage"></ion-nav>`,
  providers: [UserRegistrationService, GlobalStateService, Logger]
})

export class MyApp {

  // Hack to squeeze the NavController into the app bootstrap process
  // https://forum.ionicframework.com/t/no-provider-for-navcontroller-error-in-rc4/75846/2
  @ViewChild('myNav') navCtrl: NavController;
  rootPage = WelcomePage;

  constructor(
    platform: Platform,
    globals: GlobalStateService
  ) {
    if (DEBUG_MODE) console.log('MyApp.constructor()');
    platform.ready().then(() => {
      if (DEBUG_MODE) console.log('MyApp.constructor() => platform.ready()');
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      new StatusBar().styleDefault();
      if (globals.isSignedIn()) {
        if (DEBUG_MODE) console.log('MyApp.constructor() - user is logged in.');

        this.navCtrl.setRoot(TabsPage);
        this.navCtrl.popToRoot({animate: false});

       }
    });
  }
}
