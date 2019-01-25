import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './home/home.module#HomePageModule'
  },
  {
    path: 'list',
    loadChildren: './list/list.module#ListPageModule'
  },
  { path: 'account-login', loadChildren: './account-login/account-login.module#AccountLoginPageModule' },
  { path: 'account-register', loadChildren: './account-register/account-register.module#AccountRegisterPageModule' },
  { path: 'customer-add', loadChildren: './customer-add/customer-add.module#CustomerAddPageModule' },
  { path: 'customer-list', loadChildren: './customer-list/customer-list.module#CustomerListPageModule' },
  { path: 'customer-edit', loadChildren: './customer-edit/customer-edit.module#CustomerEditPageModule' },
  { path: 'facial-cabin-add', loadChildren: './facial-cabin-add/facial-cabin-add.module#FacialCabinAddPageModule' },
  { path: 'facial-cabin-list', loadChildren: './facial-cabin-list/facial-cabin-list.module#FacialCabinListPageModule' },
  { path: 'facial-cabin-edit', loadChildren: './facial-cabin-edit/facial-cabin-edit.module#FacialCabinEditPageModule' },
  { path: 'customer-booking', loadChildren: './customer-booking/customer-booking.module#CustomerBookingPageModule' },
  { path: 'appointment-add', loadChildren: './appointment-add/appointment-add.module#AppointmentAddPageModule' },
  { path: 'calendar-view', loadChildren: './calendar-view/calendar-view.module#CalendarViewPageModule' },
  { path: 'reports', loadChildren: './reports/reports.module#ReportsPageModule' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
