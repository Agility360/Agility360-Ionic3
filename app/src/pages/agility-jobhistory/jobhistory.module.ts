import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JobhistoryPage } from './jobhistory';

@NgModule({
  declarations: [
    JobhistoryPage,
  ],
  imports: [
    IonicPageModule.forChild(JobhistoryPage),
  ],
})
export class JobhistoryPageModule {}
