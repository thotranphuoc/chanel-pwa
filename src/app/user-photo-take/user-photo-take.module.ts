import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { UserPhotoTakePage } from './user-photo-take.page';

const routes: Routes = [
  {
    path: '',
    component: UserPhotoTakePage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserPhotoTakePage]
})
export class UserPhotoTakePageModule {}
