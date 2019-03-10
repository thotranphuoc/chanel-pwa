import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AppointmentCalendarEditNewPage } from './appointment-calendar-edit-new.page';

const routes: Routes = [
  {
    path: '',
    component: AppointmentCalendarEditNewPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AppointmentCalendarEditNewPage]
})
export class AppointmentCalendarEditNewPageModule {}
