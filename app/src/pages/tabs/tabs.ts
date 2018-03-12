import { Component }         from '@angular/core';
import { NavParams, Tab, Tabs } from 'ionic-angular';
import { GlobalStateService } from '../../services/global-state.service';

//import { BookingsPage }      from '../bookings/bookings';
import { WelcomePage }       from '../welcome/welcome';
//import { LocationListPage } from '../location-list/location-list';
//import { AccountPage }       from '../account/account';


import { SettingsPage } from '../agility-settings/settings';
import { JobsPage } from '../agility-jobs/jobs';
import { NewsPage } from '../agility-news/news';
import { ResumeTipsPage } from '../agility-resume-tips/resume-tips';
import { NotificationsPage } from '../agility-notifications/notifications';


@Component({
  templateUrl: 'tabs.html'
})

export class TabsPage {
  // this tells the tabs component which Pages
  // should be each tab's root Page
  tab1Root: any = JobsPage;
  tab2Root = NewsPage;
  tab3Root = ResumeTipsPage;
  tab4Root = NotificationsPage;
  tab5Root = SettingsPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams, public globals: GlobalStateService) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

  isLoggedIn(): boolean {
    return this.globals.isSignedIn();
  }

  showRoot(tabs : Tabs, index : number) {
    // if a child page is associated with that Tab, then pop it off the NavController stack
    let tab : Tab = tabs.getByIndex(index);
    let views = tab['_views'];
    if (views.length > 1) {
      let navController = views[views.length - 1].instance.navCtrl
      if (navController) {
        navController.popToRoot({animate: false});
      }
    }
	}
}
