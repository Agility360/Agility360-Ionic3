import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, AlertController } from 'ionic-angular';

import { DEBUG_MODE } from '../../shared/constants';
import { Candidate } from '../../shared/candidate';
import { Industries } from '../../shared/industries';
import { Professions } from '../../shared/professions';
import { States } from '../../shared/states';

import { CandidateProvider } from '../../providers/candidate';
import { IndustriesProvider } from '../../providers/industries';
import { ProfessionsProvider } from '../../providers/professions';
import { StatesProvider } from '../../providers/states';

@IonicPage()
@Component({
  selector: 'page-profile-edit',
  templateUrl: 'profile-edit.html',
})
export class ProfileEditPage {

  public obj: Candidate;
  public industries: Industries[];
  public subIndustries: Industries[];
  public professions: Professions[];
  public subProfessions: Professions[];
  public states: States[];
  public telephoneMask: any[] = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];

  public error: any;
  private shouldConfirmWindowClose: boolean;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private provider: CandidateProvider,
    private industriesProvider: IndustriesProvider,
    private professionsProvider: ProfessionsProvider,
    private statesProvider: StatesProvider,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController) {

    if (DEBUG_MODE) console.log('ProfileEditPage.constructor()');
    this.obj = navParams.get('obj');
    this.shouldConfirmWindowClose = true;

    /* initialize Industries and Professions and States objects */
    this.industriesProvider.get(null)
      .subscribe(
      results => {
        if (DEBUG_MODE) console.log('ProfileEditPage.constructor() - initialized Industries', results);
        this.industries = results
      },
      err => {
        if (DEBUG_MODE) console.log('ProfileEditPage.constructor() - Error initializing Industries', err);
        this.error = <any>err
      });

    this.professionsProvider.get(null)
      .subscribe(
      results => {
        if (DEBUG_MODE) console.log('ProfileEditPage.constructor() - initialized Professions', results);
        this.professions = results
      },
      err => {
        if (DEBUG_MODE) console.log('ProfileEditPage.constructor() - Error initializing Professions', err);
        this.error = <any>err
      });

      this.statesProvider.get()
        .subscribe(
        results => {
          if (DEBUG_MODE) console.log('ProfileEditPage.constructor() - initialized States', results);
          this.states = results
        },
        err => {
          if (DEBUG_MODE) console.log('ProfileEditPage.constructor() - Error initializing States', err);
          this.error = <any>err
        });

    /*
      initialize sub-Industries and sub-Professions objects.
      these get refreshed any time the Industry or Profession change, so these are implemented as functions.
    */
    this.getSubIndustry();
    this.getSubProfession();
  }

  getSubIndustry() {
    if (DEBUG_MODE) console.log('ProfileEditPage.getSubIndustry()');
    this.industriesProvider.get(this.obj.industry_id)
      .subscribe(
      results => {
        if (DEBUG_MODE) console.log('ProfileEditPage.getSubIndustry() - success', results);
        this.subIndustries = results
      },
      err => {
        if (DEBUG_MODE) console.log('ProfileEditPage.getSubIndustry() - Error', err);
        this.error = <any>err
      });

  }

  getSubIndustrySize(): number {
    return this.subIndustries.length;
  }

  getSubProfession() {
    if (DEBUG_MODE) console.log('ProfileEditPage.getSubProfession()');
    this.professionsProvider.get(this.obj.profession_id)
      .subscribe(
      results => {
        if (DEBUG_MODE) console.log('ProfileEditPage.getSubProfession() - success', results);
        this.subProfessions = results
      },
      err => {
        if (DEBUG_MODE) console.log('ProfileEditPage.getSubProfession() - Error', err);
        this.error = <any>err
      });

  }

  getSubProfessionSize(): number {
    return this.subProfessions.length;
  }

  industryIdDidChange() {
    if (DEBUG_MODE) console.log('ProfileEditPage.industryIdDidChange()');
    this.getSubIndustry();
    this.obj.subindustry_id = null;
  }

  professionIdDidChange() {
    if (DEBUG_MODE) console.log('ProfileEditPage.professionIdDidChange()');
    this.getSubProfession();
    this.obj.subprofession_id = null;
  }

  save() {
    if (DEBUG_MODE) console.log('ProfileEditPage.save()');

    let toast = this.toastCtrl.create({
      message: 'Success.',
      duration: 2000
    });


    this.provider.update(this.obj)
      .subscribe(obj => {
        if (DEBUG_MODE) console.log('ProfileEditPage.processForm() - Added obj: ', this.obj);
        toast.present();
        this.shouldConfirmWindowClose = false;
        /* this.navCtrl.getActiveChildNav() */
        this.exitPage();
      },
      error => {
        this.shouldConfirmWindowClose = true;
        this.error = error;
      });



  }

  private exitPage() {
    if (DEBUG_MODE) console.log('ProfileEditPage.exitPage()');
    this.shouldConfirmWindowClose = false;
    this.navCtrl.pop();
  }

  ionViewDidLoad() {
    if (DEBUG_MODE) console.log('ProfileEditPage.ionViewDidLoad()');
  }

  ionViewCanLeave() {
    if (DEBUG_MODE) console.log('ProfileEditPage.ionViewCanLeave()');
    if (this.shouldConfirmWindowClose) {
      let alert = this.alertCtrl.create({
        title: 'Exit',
        message: 'Discard changes?',
        buttons: [{
          text: 'Discard',
          handler: () => {
            this.exitPage();
          }
        },
        {
          text: 'Cancel',
          handler: () => {
            // need to do something if the user stays?
          }
        }]
      });

      // Show the alert
      alert.present();

      // Return false to avoid the page to be popped up
      return false;
    }
  }


}
