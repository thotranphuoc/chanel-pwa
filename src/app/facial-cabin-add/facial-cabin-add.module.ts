import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { FacialCabinAddPage } from './facial-cabin-add.page';

const routes: Routes = [
  {
    path: '',
    component: FacialCabinAddPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [FacialCabinAddPage]
})
export class FacialCabinAddPageModule {}
