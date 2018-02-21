import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CertificationsPage } from './certifications';

@NgModule({
  declarations: [
    CertificationsPage,
  ],
  imports: [
    IonicPageModule.forChild(CertificationsPage),
  ],
})
export class CertificationsPageModule {}
