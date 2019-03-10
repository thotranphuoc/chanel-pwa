import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { iUser } from './interfaces/user.interface';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent implements OnInit {

  public appPagex = [
    { title: 'Trang Chủ', url: '/home', icon: 'home' },
    { title: 'Khách hàng', url: '/customers', icon: 'contacts' },
    { title: 'Lịch hẹn', url: '/calendars', icon: 'calendar' },
    { title: 'Báo cáo', url: '/reports', icon: 'stats' },
    { title: 'Nhân viên', url: '/users', icon: 'contacts' },
    { title: 'Lịch làm việc', url: '/slot-assign', icon: 'calendar' },
    { title: 'Đăng nhập', url: '/account', icon: 'lock' },
    { title: 'Đăng xuất', url: '/account', icon: 'unlock' }
  ];
  USER: iUser = null;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public authService: AuthService,
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
    console.log(this.isAdminManager());
    this.loadSideMenu();
    this.authService.userChange.subscribe(user => {
      this.USER = user;
      console.log(this.USER);
      this.loadSideMenu();
    })
  }

  loadSideMenu() {
    if (this.isFABA()) {
      this.appPagex = [
        { title: 'Trang Chủ', url: '/home', icon: 'home' },
        { title: 'Khách hàng', url: '/customers', icon: 'contacts' },
        { title: 'Lịch hẹn', url: '/calendars', icon: 'calendar' },
        { title: 'Đăng xuất', url: '/account', icon: 'unlock' }
      ];
      return;
    }
    if (this.isAdminManager()) {
      this.appPagex = [
        { title: 'Trang Chủ', url: '/home', icon: 'home' },
        { title: 'Khách hàng', url: '/customers', icon: 'contacts' },
        { title: 'Lịch hẹn', url: '/calendars', icon: 'calendar' },
        { title: 'Báo cáo', url: '/reports', icon: 'stats' },
        { title: 'Nhân viên', url: '/users', icon: 'contacts' },
        { title: 'Lịch làm việc', url: '/slot-assign', icon: 'calendar' },
        { title: 'Quản lý booking', url: '/appointments-manage', icon: 'md-briefcase'},
        { title: 'Đăng xuất', url: '/account', icon: 'unlock' }
      ];
      return;
    }
    if (this.isSpecialist()) {
      this.appPagex = [
        { title: 'Trang Chủ', url: '/home', icon: 'home' },
        { title: 'Khách hàng', url: '/customers', icon: 'contacts' },
        { title: 'Lịch hẹn', url: '/calendars', icon: 'calendar' },
        { title: 'Lịch làm việc', url: '/slot-assign', icon: 'calendar' },
        { title: 'Đăng xuất', url: '/account', icon: 'unlock' }
      ];
      return;
    }
    this.appPagex = [
      { title: 'Trang Chủ', url: '/home', icon: 'home' },
      { title: 'Đăng nhập', url: '/account', icon: 'lock' },
    ];
  }

  isAdminManager() {
    if (!this.USER) return false;
    if (this.USER.U_ROLE == 'Manager' || this.USER.U_ROLE == 'Admin') return true;
    return false;
  }

  isSpecialist() {
    if (!this.USER) return false;
    if (this.USER.U_ROLE == 'Specialist') return true;
    return false;
  }

  isFABA() {
    if (!this.USER) return false;
    if (this.USER.U_ROLE == 'BA' || this.USER.U_ROLE == 'BAS') return true;
    return false;
  }
}