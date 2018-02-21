import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EducationDetailPage } from './education-detail';

@NgModule({
  declarations: [
    EducationDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(EducationDetailPage),
  ],
})
export class EducationDetailPageModule {}
