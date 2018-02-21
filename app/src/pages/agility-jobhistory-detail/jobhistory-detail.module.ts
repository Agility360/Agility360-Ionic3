import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobhistoryDetailPage } from './jobhistory-detail';

@NgModule({
  declarations: [
    JobhistoryDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(JobhistoryDetailPage),
  ],
})
export class JobhistoryDetailPageModule {}
