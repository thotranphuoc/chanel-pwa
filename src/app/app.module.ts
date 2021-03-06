import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

// angularfire setup
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment'
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';

// firebase setup
import * as firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { CustomerAddPageModule } from './customer-add/customer-add.module';
import { AppointmentAddPageModule } from './appointment-add/appointment-add.module';
import { AppointmentEditPageModule } from './appointment-edit/appointment-edit.module';
import { SlotsInDayPageModule } from './slots-in-day/slots-in-day.module';
import { DbService } from './services/db.service';
import { PhotoTakePageModule } from './photo-take/photo-take.module';
import { UserPhotoTakePageModule } from './user-photo-take/user-photo-take.module';
import { ImageService } from './services/image.service';
import { PapaParseModule } from 'ngx-papaparse';
import { AppointmentCalendarEditNewPageModule } from './appointment-calendar-edit-new/appointment-calendar-edit-new.module';
import { SearchPageModule } from './search/search.module';
import { HttpModule } from '@angular/http';
import { ReportShowHistoryPage } from './report-show-history/report-show-history.page';
import { ReportShowHistoryPageModule } from './report-show-history/report-show-history.module';
firebase.initializeApp(environment.firebase);

@NgModule({
  declarations: [AppComponent],
  entryComponents: [

  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebase),
    HttpClientModule,
    HttpModule,
    BrowserAnimationsModule,
    CommonModule,
    FormsModule,
    PapaParseModule,
    NgbModalModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory
    }),
    CustomerAddPageModule,
    AppointmentAddPageModule,
    AppointmentEditPageModule,
    AppointmentCalendarEditNewPageModule,
    SlotsInDayPageModule,
    UserPhotoTakePageModule,
    SearchPageModule,
    ReportShowHistoryPageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    DbService,
    ImageService,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }