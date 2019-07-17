import { Component, OnInit } from '@angular/core';
import { NavController, NavParams, ModalController } from '@ionic/angular';
import { LocalService } from '../services/local.service';
import { CrudService } from '../services/crud.service';
import { SetgetService } from '../services/setget.service';
import { AppService } from '../services/app.service';
import { DbService } from '../services/db.service';
import { iBooking } from '../interfaces/booking.interface';
import { iUser } from '../interfaces/user.interface';
import { ExcelService } from '../excel.service';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-report-show-history',
  templateUrl: './report-show-history.page.html',
  styleUrls: ['./report-show-history.page.scss'],
})
export class ReportShowHistoryPage implements OnInit {
  BOOKINGS: any;
  USER:iUser;
  data: any;
  constructor(
    private navPar: NavParams,
    private navCtrl: NavController,
    private localService: LocalService,
    private crudService: CrudService,
    private setGetService: SetgetService,
    private appService: AppService,
    private dbService: DbService,
    public modalController: ModalController,
    private excelService: ExcelService,
    private loadingService: LoadingService,
    
  ) { }

  ngOnInit() {
    this.data = this.navPar.data;
    console.log(this.data);
    this.BOOKINGS=this.data.BOOKINGS;
    this.USER = this.localService.USER;
    console.log(this.BOOKINGS);
    
  }

  doCancel() {
    console.log('doCancel, goback')
    //this.navCtrl.goBack();
    this.modalController.getTop().then(res => {
      console.log(res);
      if (typeof (res) !== 'undefined') res.dismiss({isCancel: true });
    }).catch(err => { console.log(err) });
  }

  exportFile(BOOKINGS: iBooking[])
  {
    this.generateThenDownloadBookingsReport(BOOKINGS,'HISTORY_');
  }

  generateThenDownloadBookingsReport(BOOKINGS: iBooking[], NAME: string) {
    let _BOOKINGS = [];
    BOOKINGS.forEach(B => {
      let _BOOKING = {};
      _BOOKING['Khách hàng'] = B.B_CUSTOMER_NAME;
      _BOOKING['VIPCODE'] = B.B_CUSTOMER_VIPCODE;
      _BOOKING['SĐT'] = B.B_CUSTOMER_PHONE;
      _BOOKING['Sublimage'] = B.B_SUBLIMAGE ? '1' : '0';
      _BOOKING['Le Lift'] = B.B_LELIFT ? '1' : '0';
      _BOOKING['MakeUp'] = B.B_FASHION ? '1' : '0';
      _BOOKING['Nước hoa'] = B.B_FASHION ? '1' : '0';
      _BOOKING['Fashion'] = B.B_FASHION ? '1' : '0';
      _BOOKING['Ngày'] = B.B_DATE;
      _BOOKING['Slot'] = B.B_SLOT;
      _BOOKING['Specialist'] = B.B_SPECIALIST_NAME;
      _BOOKING['BA book'] = B.B_BA_BOOK.U_FULLNAME;
      _BOOKING['BA Sale'] = B.B_BA_SELL_NAME;
      _BOOKING['Location'] = B.B_BA_BOOK.U_LOCATION;
      _BOOKING['Tổng'] = B.B_TOTAL ? B.B_TOTAL : '0';
      _BOOKING['Till'] = B.B_TILL ? B.B_TILL : '0';
      _BOOKING['Sale Memo'] = B.B_MEMOS ? B.B_MEMOS : '0';
      _BOOKING['SCCU'] = B.B_CSCU ? '1' : '0';
      _BOOKING['KH mới'] = B.B_isNewCustomer ? '1' : '0';
      _BOOKING['Trạng thái'] = this.convertState(B.B_STATUS);
      _BOOKINGS.push(_BOOKING);
    })
    console.log(_BOOKINGS);
    this.excelService.exportFromArrayOfObject2Excel(_BOOKINGS, NAME);
    this.loadingService.loadingDissmiss();
  }

  convertState(STATE: string) {
    switch (STATE) {
      case 'AVAILABLE':
        return 'TRỐNG'
      case 'BOOKED':
        return 'ĐÃ ĐẶT'
      case 'COMPLETED':
        return 'HOÀN THÀNH'
      case 'CANCELED':
        return 'HUỶ BỎ'
      case 'EXPIRED':
        return 'HẾT HẠN'
      case 'DRAFT':
        return 'CHỜ DUYỆT'
      case 'BLOCKED':
        return 'KHOÁ'
      default:
        return 'N/A'
    }
  }
}
