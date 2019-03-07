import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { BookingHistoryDetailPage } from './booking-history-detail.page';

const routes: Routes = [
  {
    path: '',
    component: BookingHistoryDetailPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [BookingHistoryDetailPage]
})
export class BookingHistoryDetailPageModule {}
