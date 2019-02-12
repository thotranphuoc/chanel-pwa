import { Component, OnInit } from '@angular/core';
import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

import { StatusBar } from '@ionic-native/status-bar/ngx';
<<<<<<< HEAD
import { MessagingService } from "./shared/messaging.service";
=======
import { AuthService } from './services/auth.service';
>>>>>>> acb71b67687a4150839652607218c9da7c070edf

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
<<<<<<< HEAD
export class AppComponent {
  message;
=======
export class AppComponent implements OnInit {
>>>>>>> acb71b67687a4150839652607218c9da7c070edf
  public appPages = [
    { title: 'Home', url: '/home', icon: 'home' },
    { title: 'Customers', url: '/customers', icon: 'contacts' },
    { title: 'Calendars', url: '/calendars', icon: 'calendar' },
    { title: 'Reports', url: '/reports', icon: 'stats' },

  ];

  public appPages1 = [
    { title: 'Login', url: '/account', icon: 'lock' }
  ];

  public appPages2 = [
    { title: 'Logout', url: '/account', icon: 'unlock' }
  ];


  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
<<<<<<< HEAD
    private messagingService: MessagingService
=======
    public authService: AuthService
>>>>>>> acb71b67687a4150839652607218c9da7c070edf
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

  ngOnInit() {
    this.authService.initAuthListener();
  }
}
