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
  { path: 'account-manager', loadChildren: './account-manager/account-manager.module#AccountManagerPageModule' },
  { path: 'account-information', loadChildren: './account-information/account-information.module#AccountInformationPageModule' },
  { path: 'reports', loadChildren: './reports/reports.module#ReportsPageModule' },
  { path: 'calendars', loadChildren: './calendars/calendars.module#CalendarsPageModule' },
  { path: 'test', loadChildren: './test/test.module#TestPageModule' },
  { path: 'account', loadChildren: './account/account.module#AccountPageModule' },
  { path: 'user-new-add', loadChildren: './user-new-add/user-new-add.module#UserNewAddPageModule' },
  { path: 'appointment-edit', loadChildren: './appointment-edit/appointment-edit.module#AppointmentEditPageModule' },
  { path: 'customers', loadChildren: './customers/customers.module#CustomersPageModule' },
  { path: 'users', loadChildren: './users/users.module#UsersPageModule' },
  { path: 'user-edit', loadChildren: './user-edit/user-edit.module#UserEditPageModule' },
  { path: 'slots-in-day', loadChildren: './slots-in-day/slots-in-day.module#SlotsInDayPageModule' },
  { path: 'appointment-calendar-edit', loadChildren: './appointment-calendar-edit/appointment-calendar-edit.module#AppointmentCalendarEditPageModule' },
  { path: 'slot-assign', loadChildren: './slot-assign/slot-assign.module#SlotAssignPageModule' },
  { path: 'photo-take', loadChildren: './photo-take/photo-take.module#PhotoTakePageModule' },
  { path: 'user-photo-take', loadChildren: './user-photo-take/user-photo-take.module#UserPhotoTakePageModule' },
  { path: 'calendar-upload', loadChildren: './calendar-upload/calendar-upload.module#CalendarUploadPageModule' },
  { path: 'booking-history', loadChildren: './booking-history/booking-history.module#BookingHistoryPageModule' },
  { path: 'booking-history-detail', loadChildren: './booking-history-detail/booking-history-detail.module#BookingHistoryDetailPageModule' },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
