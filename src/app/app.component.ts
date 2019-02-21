import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Trang Chủ', url: '/home', icon: 'home' },
    { title: 'Khách hàng', url: '/customers', icon: 'contacts' },
    { title: 'Lịch hẹn', url: '/calendars', icon: 'calendar' },
    { title: 'Báo cáo', url: '/reports', icon: 'stats' },

  ];

  public appPages1 = [
    { title: 'Đăng nhập', url: '/account', icon: 'lock' }
  ];

  // Loggin user menus
  public appPages2 = [
    { title: 'Đăng xuất', url: '/account', icon: 'unlock' }
  ];

  // Admin menus
  public appPages3 = [
    { title: 'Nhân viên', url: '/users', icon: 'contacts' },
    { title: 'Lịch làm việc', url: '/slot-assign', icon: 'calendar' }
  ];

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService: AuthService
  ) {
    this.initializeApp();
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