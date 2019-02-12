import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MessagingService } from "./shared/messaging.service";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  message;
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Customers', url: '/customer-list', icon: 'contacts' },
    { title: 'Calendars', url: '/calendars', icon: 'calendar' },
    { title: 'Reports', url: '/reports', icon: 'stats' },
    { title: 'Login', url: '/account-login', icon: 'lock' }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private messagingService: MessagingService
  ) {
    this.initializeApp();
    const userId = 'WCZDdZHAKEbLjUbnXuseww33pzf1';
    this.messagingService.requestPermission(userId)
    this.messagingService.receiveMessage()
    this.message = this.messagingService.currentMessage
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
