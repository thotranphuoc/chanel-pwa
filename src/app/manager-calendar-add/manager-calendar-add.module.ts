import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ManagerCalendarAddPage } from './manager-calendar-add.page';

const routes: Routes = [
  {
    path: '',
    component: ManagerCalendarAddPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ManagerCalendarAddPage]
})
export class ManagerCalendarAddPageModule {}
