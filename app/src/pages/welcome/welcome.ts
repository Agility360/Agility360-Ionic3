import { Component }          from '@angular/core';
import { NavController }      from 'ionic-angular';
import { GlobalStateService } from '../../services/global-state.service';
import { NavbarComponent } from '../../components/navbar';
import { DEBUG_MODE } from '../../shared/constants';

@Component({
  selector: 'welcome',
  templateUrl: 'welcome.html',
})
export class WelcomePage {

  public pageTitle: string;

  constructor(public navCtrl: NavController, public globals: GlobalStateService) {
    if (DEBUG_MODE) console.log('WelcomePage.constructor()');

  }
}
