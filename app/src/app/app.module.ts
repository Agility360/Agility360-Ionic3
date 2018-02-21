import { NgModule }                    from '@angular/core';
import { IonicApp, IonicModule, App, LoadingController, AlertController }       from 'ionic-angular';
import { MyApp }                       from './app.component';
import { HttpModule, URLSearchParams } from "@angular/http";
import { BrowserTab }                  from '@ionic-native/browser-tab';
import { Deeplinks }                   from '@ionic-native/deeplinks';
import { ComponentsModule }            from "../components/components.module";
import { NavbarComponent }             from "../components/navbar/navbar";

import { AboutPage }                   from '../pages/about/about';
import { AccountConfirmationCodePage } from '../pages/account-confirmation-code/account-confirmation-code';
import { AccountChangePasswordPage }   from '../pages/account-change-password/account-change-password';
import { AccountForgotPasswordPage }   from '../pages/account-forgot-password/account-forgot-password';
import { AccountPage }                 from '../pages/account/account';
import { AccountSigninPage }           from '../pages/account-signin/account-signin';
import { AccountSignupPage }           from '../pages/account-signup/account-signup';
import { BookingsPage }                from '../pages/bookings/bookings';
import { LocationListPage }            from '../pages/location-list/location-list';
import { LocationAddPage }             from '../pages/location-add/location-add';
import { ResourceListPage }            from '../pages/resource-list/resource-list';
import { ResourceAddPage }             from '../pages/resource-add/resource-add';
import { ResourceAvailabilityPage }    from '../pages/resource-availability/resource-availability';
import { TabsPage }                    from '../pages/tabs/tabs';
import { WelcomePage }                 from '../pages/welcome/welcome';
import { BrowserModule }               from "@angular/platform-browser";
import { HttpService }                 from "../services/http-service";
import {
  IamAuthorizerClient,
  CustomAuthorizerClient,
  UserPoolsAuthorizerClient,
  NoAuthorizationClient
} from "../services/spacefinder-api.service";

/* Addded by McDaniel */
/* ------------------------------------------------------- */
import { apiURL, cmsURL } from '../shared/constants';
import { ProcessHttpmsgProvider } from '../providers/process-httpmsg';
import { CandidateProvider } from '../providers/candidate';
import { CertificationHistoryProvider } from '../providers/certificationhistory';
import { EducationHistoryProvider } from '../providers/educationhistory';
import { JobHistoryProvider } from '../providers/jobhistory';
import { WordpressProvider } from '../providers/wordpress';
import { IndustriesProvider } from '../providers/industries';
import { ProfessionsProvider } from '../providers/professions';
import { StatesProvider } from '../providers/states';
import { SafeHtmlPipe } from "../shared/pipe.safehtml";
import { XHRBackend, RequestOptions } from '@angular/http';
import { TextMaskModule } from 'angular2-text-mask';
import { PdfViewerComponent } from 'ng2-pdf-viewer';

/*
export function httpFactory(
  backend: XHRBackend,
  defaultOptions: RequestOptions,
  app: App,
  loadingCtrl: LoadingController,
  alertCtrl: AlertController) {
  return new HttpService(backend, defaultOptions, app, loadingCtrl);
}
*/

/* ------------------------------------------------------- */
@NgModule({
  declarations: [
    AccountConfirmationCodePage,
    AccountChangePasswordPage,
    AccountForgotPasswordPage,
    AccountPage,
    AccountSigninPage,
    AccountSignupPage,
    BookingsPage,
    LocationAddPage,
    LocationListPage,
    ResourceAddPage,
    ResourceListPage,
    ResourceAvailabilityPage,
    MyApp,
    TabsPage,
    WelcomePage,
    NavbarComponent
  ],
  imports: [
    HttpModule,
    IonicModule.forRoot(MyApp),
    BrowserModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    AccountConfirmationCodePage,
    AccountChangePasswordPage,
    AccountForgotPasswordPage,
    AccountPage,
    AccountSigninPage,
    AccountSignupPage,
    BookingsPage,
    LocationAddPage,
    LocationListPage,
    ResourceAddPage,
    ResourceListPage,
    ResourceAvailabilityPage,
    MyApp,
    TabsPage,
    WelcomePage
  ],
  providers: [
    BrowserTab,
    Deeplinks,
    ComponentsModule,
    { provide: HttpService, useClass: HttpService },
    { provide: CustomAuthorizerClient, useClass: CustomAuthorizerClient },
    { provide: IamAuthorizerClient, useClass: IamAuthorizerClient },
    { provide: UserPoolsAuthorizerClient, useClass: UserPoolsAuthorizerClient },
    { provide: NoAuthorizationClient, useClass: NoAuthorizationClient },
  ]
})
export class AppModule {}
