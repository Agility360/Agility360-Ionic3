import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CertificationDetailPage } from './certification-detail';

@NgModule({
  declarations: [
    CertificationDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(CertificationDetailPage),
  ],
})
export class CertificationDetailPageModule {}
