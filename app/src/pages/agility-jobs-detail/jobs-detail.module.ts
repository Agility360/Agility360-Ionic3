import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobsDetailPage } from './jobs-detail';

@NgModule({
  declarations: [
    JobsDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(JobsDetailPage),
  ],
})
export class JobsDetailPageModule {}
