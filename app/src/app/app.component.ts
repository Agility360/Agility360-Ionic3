import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { TabsPage } from '../pages/tabs/tabs';
import { UserRegistrationService }     from '../services/account-management.service';
import { Logger }     from '../services/logger.service';
import { GlobalStateService } from '../services/global-state.service';

import { WelcomePage } from '../pages/welcome/welcome';
import { DEBUG_MODE } from '../shared/constants';

@Component({
  template: `<ion-nav [root]="rootPage"></ion-nav>`,
  providers: [UserRegistrationService, GlobalStateService, Logger]
})
export class MyApp {
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

       }
    });
  }
}
