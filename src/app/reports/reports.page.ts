import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { iBooking } from '../interfaces/booking.interface';
import { ExcelService } from '../excel.service';
import { iCustomer } from '../interfaces/customer.interface';
import { AppService } from '../services/app.service';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  selectedReport: string = 'Bookings';
  CUSTOMERS: iCustomer[] = [];
  CUSTOMERS_: iCustomer[] = [];
  constructor(
    private crudService: CrudService,
    private excelService: ExcelService,
    private appService: AppService
  ) { }

  ngOnInit() {
    // this.downloadBookingsReport();
    // this.downloadCustomersReport();

    this.getCustomers();
  }

  getCustomers() {
    this.crudService.customersAllGet().then((res: any) => {
      this.CUSTOMERS = res.CUSTOMERS;
      this.CUSTOMERS_ = this.CUSTOMERS.slice(0);
    })
      .catch(err => {
        console.log(err);
      })
  }

  downloadBookingsReport() {
    let BOOKINGS: iBooking[] = [];
    this.crudService.bookingsAllGet().then((res: any) => {
      console.log(res);
      BOOKINGS = res.BOOKINGS;
      this.generateThenDownloadBookingsReport(BOOKINGS, 'BOOKINGS_');
    })
      .catch(err => { console.log(err) })
  }

  downloadBookingsReportFromTo(FROM: string, TO: string) {
    let BOOKINGS: iBooking[] = [];
    this.crudService.bookingsFromToGet(FROM, TO).then((res: any) => {
      console.log(res);
      BOOKINGS = res.BOOKINGS;
      this.generateThenDownloadBookingsReport(BOOKINGS, 'BOOKINGS_' + FROM + '_' + TO + '_');
    })
      .catch(err => { console.log(err) })
  }

  generateThenDownloadBookingsReport(BOOKINGS: iBooking[], NAME: string) {
    let _BOOKINGS = [];
    BOOKINGS.forEach(B => {
      let _BOOKING = {};
      _BOOKING['Trạng thái'] = this.convertState(B.B_STATUS);
      _BOOKING['Ngày'] = B.B_DATE;
      _BOOKING['Slot'] = B.B_SLOT;
      _BOOKING['VIPCODE'] = B.B_CUSTOMER_VIPCODE;
      _BOOKING['Khách hàng'] = B.B_CUSTOMER_NAME;
      _BOOKING['Specialist'] = B.B_SPECIALIST_NAME;
      _BOOKING['BA book'] = B.B_BA_BOOK.U_FULLNAME;
      _BOOKING['BA Sale'] = B.B_BA_SELL_NAME;
      _BOOKING['Tổng'] = B.B_TOTAL ? B.B_TOTAL : '0';
      _BOOKING['SCCU'] = B.B_CSCU ? 'Yes' : 'No';
      _BOOKING['Sublimage'] = B.B_SUBLIMAGE ? 'Yes' : 'No';
      _BOOKING['Le Lift'] = B.B_LELIFT ? 'Yes' : 'No';
      _BOOKING['Fashion'] = B.B_FASHION ? 'Yes' : 'No';
      _BOOKING['KH mới'] = B.B_isNewCustomer ? 'Yes' : 'No';
      _BOOKINGS.push(_BOOKING);
    })
    console.log(_BOOKINGS);
    this.excelService.exportFromArrayOfObject2Excel(_BOOKINGS, NAME);
  }

  downloadCustomersReport() {
    let _CUSTOMERS = [];
    this.CUSTOMERS.forEach(C => {
      let _CUSTOMER = {};
      _CUSTOMER['Tên'] = C.C_NAME;
      _CUSTOMER['VIPCODE'] = C.C_VIPCODE;
      _CUSTOMER['SĐT'] = C.C_PHONE;
      _CUSTOMER['Sublimage'] = C.C_SUBLIMAGE ? 'Yes' : 'No';
      _CUSTOMER['Le Lift'] = C.C_LELIFT ? 'Yes' : 'No';
      _CUSTOMER['Makeup'] = C.C_MAKEUP ? 'Yes' : 'No';
      _CUSTOMER['Perfume'] = C.C_PERFUME ? 'Yes' : 'No';
      _CUSTOMER['Fashtion'] = C.C_FASHION ? 'Yes' : 'No';
      _CUSTOMER['Đã đặt'] = this.countBookingsOfCustomer(C.C_BOOKINGS, null);
      _CUSTOMER['Huỷ bỏ'] = this.countBookingsOfCustomer(C.C_BOOKINGS, "CANCELED");
      _CUSTOMER['Đã sử dụng'] = this.countBookingsOfCustomer(C.C_BOOKINGS, "COMPLETED");
      _CUSTOMERS.push(_CUSTOMER);
    })
    console.log(_CUSTOMERS);
    this.excelService.exportFromArrayOfObject2Excel(_CUSTOMERS, 'CUSTOMERS_');
  }

  countBookingsOfCustomer(BOOKINGS: Object, STATE: string) {
    let ARR = this.appService.convertObj2Array(BOOKINGS);
    // console.log(ARR);
    if (STATE) {
      let ARR_ = ARR.filter(item => item.STATE == STATE);
      return ARR_.length;
    } else {
      return ARR.length;
    }
  }

  convertTrueFalse2YesNo(BOOL: boolean) {
    if (BOOL) return 'Yes';
    return 'No';
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



  selectReport(Report: string) {
    console.log(Report);
    this.selectedReport = Report;
  }

  selectFrom(D) {
    console.log(D)
  }
  selectTo(D) {
    console.log(D)
  }

  isOverallDisabled(From, To) {
    if (typeof (From) == 'undefined') return true;
    if (typeof (To) == 'undefined') return true;
    return false;
  }


  search(e: string) {
    console.log(e);
    let str = e.toLowerCase();
    console.log(str);
    if (str.length > 0) {
      this.CUSTOMERS = this.CUSTOMERS_.filter(CUS => CUS.C_PHONE.toLowerCase().indexOf(str) > -1 || CUS.C_NAME.toLowerCase().indexOf(str) > -1)
    } else {
      console.log('str = 0');
      this.CUSTOMERS = this.CUSTOMERS_;
    }
  }

  getAllBookingOfCustomer(CUSTOMER: iCustomer) {
    console.log(CUSTOMER);
    this.crudService.bookingsOfCustomerGet(CUSTOMER.C_ID)
      .subscribe(qSnap => {
        let BOOKINGS = [];
        qSnap.forEach(qDocSnap => {
          let BOOKING = <iBooking>qDocSnap.data();
          BOOKINGS.push(BOOKING);
        })
        console.log(BOOKINGS);
        this.generateThenDownloadBookingsReport(BOOKINGS, CUSTOMER.C_NAME);
      })
  }


}
