import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ReportShowHistoryPage } from './report-show-history.page';

const routes: Routes = [
  {
    path: '',
    component: ReportShowHistoryPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ReportShowHistoryPage]
})
export class ReportShowHistoryPageModule {}
