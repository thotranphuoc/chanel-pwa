import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FacialCabinListPage } from './facial-cabin-list.page';

const routes: Routes = [
  {
    path: '',
    component: FacialCabinListPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FacialCabinListPage]
})
export class FacialCabinListPageModule {}
