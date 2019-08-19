import { Component, OnInit } from '@angular/core';
import { CrudService } from '../services/crud.service';
import { iBooking } from '../interfaces/booking.interface';
import { ExcelService } from '../excel.service';
import { iCustomer } from '../interfaces/customer.interface';
import { AppService } from '../services/app.service';
import { LoadingService } from '../loading.service';
import { log } from 'util';
import { ModalController } from '@ionic/angular';
import { ReportShowHistoryPage} from '../report-show-history/report-show-history.page';
import { iUser } from '../interfaces/user.interface';
import { iUserReport } from '../interfaces/reportuser.interface';
import { CalendarService } from '../services/calendar.service';
import { iDay } from '../interfaces/day.interface';
import { Subscription } from 'rxjs';
import { isThisHour } from 'date-fns';
import { iSlot } from '../interfaces/slot.interface';
import { timeout } from 'rxjs/operators';
@Component({
  selector: 'app-reports',
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.scss'],
})
export class ReportsPage implements OnInit {
  selectedReport: string = 'Bookings';
  CUSTOMERS: iCustomer[] = [];
  CUSTOMERS_: iCustomer[] = [];
  CUSTOMERSVIEW: iCustomer[] = [];
  USERS: iUser[]=[];
  USERS_: iUser[]=[];
  SPECIALISTS: iUserReport[]=[];
  BAS: iUserReport[]=[];
  TODAY: string;
  currentYYYYMM: string;
  monthSubscription: Subscription;
  SLOTS:number=0;
  AVAILIBLE:number=0;
  BOOKED:Number=0;
  CANCELED:Number=0;
  OTHER:Number=0;
  LOCATION:string='';
  MONTHOPTION:string='';
  
  constructor(
    public modalController: ModalController,
    private crudService: CrudService,
    private excelService: ExcelService,
    private appService: AppService,
    private loadingService: LoadingService,
    private calendarService: CalendarService
  ) { }

  ngOnInit() {
    this.getUsers();
    this.getCustomers();
    
  }

  ionViewWillEnter() {
  }

  getCustomers() {
    this.crudService.customersAllGet().then((res: any) => {
      //console.log('test res=', res);
      //this.CUSTOMERSVIEW = res.CUSTOMERS;
      this.CUSTOMERS = res.CUSTOMERS;
      this.CUSTOMERS_ = this.CUSTOMERS.slice(0);
    })
      .catch(err => {
        console.log(err);
      })
  }

  StoreChange(ev) {
    console.log('pt user: ',this.USERS_['USERS'].length);
    this.UpdateUser(this.USERS_, ev);
    }


  UpdateUser(USERS, ev)
  {
    console.log('pt user: ',USERS['USERS'].length);
    for(let i=0; i< USERS['USERS'].length; i++)
    {
      console.log(i);
      console.log('trc',USERS['USERS'][i].U_LOCATION);
      if(USERS['USERS'][i].U_LOCATION != ev)
        {
          console.log('i =' + i,'If',USERS['USERS'][i]);
          let removed_elements = USERS['USERS'].splice(i, 1);
          console.log('removed ',removed_elements);
          --i;
          //this.USERS['USERS'].splice(i, 1);
          //delete[this.USERS['USERS'].indexOf(i)];
        }
    }

    this.USERS=USERS;
    console.log(ev);
    console.log('USER after change',this.USERS);
    this.LOCATION=ev;
    console.log(this.MONTHOPTION);
    this.getCalendar(this.TODAY, this.MONTHOPTION);
  }

  getUsers() {
    this.crudService.usersGetALL().then((res: any) => {
          this.USERS = res;
          this.USERS_=res;
        console.log('User', this.USERS);
        this.getCalendar(null, null);
        })
      .catch(err => {
        console.log(err);
      });
  }

  checkBA(slot:iSlot){
    return true;
  }


  getCalendar(Choose_day:string, Choose_location:string){
    this.SLOTS=0;
    this.AVAILIBLE=0;
    this.BOOKED=0;
    this.CANCELED=0;
    this.OTHER=0;
    this.SPECIALISTS=[];
    this.BAS=[];
    if(Choose_day == null)
    {this.TODAY = this.calendarService.getTodayString();}
     this.currentYYYYMM = this.TODAY.substr(0, 6);
     let _35Days1: iDay[] = this.calendarService.create35DaysOfMonth(this.currentYYYYMM);

     this.loadingService.presentLoading();
    this.monthSubscription = this.crudService.calendarMonthGet(this.currentYYYYMM)
      .subscribe(data => {
        console.log('calendar',data)
        if (typeof (data) !== 'undefined') {
          
          let newdays = _35Days1.map(day => data[day.DateId]);
          let total_availible=0;
          let total_slot=0;

          for(let i:number =0; i<this.USERS['USERS'].length; i++)
          {
            let SPECIALIST:iUserReport=this.USERS['USERS'][i];
            SPECIALIST.USER=this.USERS['USERS'][i];
            SPECIALIST.Availible=0;
            SPECIALIST.Booked=0;
            SPECIALIST.Other=0;
            SPECIALIST.Canceled=0;

            let BA:iUserReport=this.USERS['USERS'][i];
            BA.USER=this.USERS['USERS'][i];
            BA.Availible=0;
            BA.Booked=0;
            BA.Other=0;
            BA.Canceled=0;
            // if(this.USERS['USERS'][i].U_ROLE=="Specialist")
            // {
            //   this.SPECIALISTS.push(SPECIALIST);
            // }

            newdays.forEach(day => {
              

              //console.log('chay = ',day);
              let n = day.Slots.filter(slot => slot.STATUS !== 'AVAILABLE').length;
              day['n'] = n;
              let isblock=false;     
              if(n>=4)
              {
                let block_ = day.Slots.filter(slot => slot.STATUS === 'BLOCKED').length;
                if(block_ >= 4)
                  isblock=true;
              }
              let isDraft= day.Slots.filter(slot => slot.STATUS === 'DRAFT').length;
              
              day['isdraft']=(isDraft>=1);
              day['isblock']=isblock;
              let isCanceled= day.Slots.filter(slot => slot.STATUS === 'CANCELED').length;
              day['isCancel']=isCanceled;
            
            let isAvailable= day.Slots.filter(slot => slot.STATUS === 'AVAILABLE' && slot.SPE_ID === this.USERS['USERS'][i].U_ID).length;
            SPECIALIST.Availible=SPECIALIST.Availible+isAvailable;
            let isBook= day.Slots.filter(slot => slot.STATUS === 'BOOKED' && slot.BAS_ID === '' &&  slot.SPE_ID === this.USERS['USERS'][i].U_ID).length;
            SPECIALIST.Booked=SPECIALIST.Booked+isBook;
            let isCancle= day.Slots.filter(slot => slot.STATUS === 'CANCELED' && slot.BAS_ID === '' &&  slot.SPE_ID === this.USERS['USERS'][i].U_ID).length;
            SPECIALIST.Canceled=SPECIALIST.Canceled+isCancle;

            let isAvailableBA= day.Slots.filter(slot => slot.STATUS === 'AVAILABLE' && slot.BAS_ID === this.USERS['USERS'][i].U_ID).length;
            BA.Availible=BA.Availible+isAvailableBA;
            let isBookBA= day.Slots.filter(slot => slot.STATUS === 'BOOKED' && slot.BAS_ID === this.USERS['USERS'][i].U_ID).length;
            BA.Booked=BA.Booked+isBookBA;
            let isCancleBA= day.Slots.filter(slot => slot.STATUS === 'CANCELED' &&  slot.BAS_ID === this.USERS['USERS'][i].U_ID).length;
            BA.Canceled=BA.Canceled+isCancleBA;

            let isOther= day.Slots.filter(slot => slot.STATUS != 'AVAILABLE' && slot.STATUS != 'BOOKED' && slot.STATUS != 'CANCELED' && slot.BAS_ID === '' && slot.SPE_ID === this.USERS['USERS'][i].U_ID).length;
            SPECIALIST.Other=SPECIALIST.Other+isOther;

            let isOtherBA= day.Slots.filter(slot => slot.STATUS != 'AVAILABLE' && slot.STATUS != 'BOOKED' && slot.STATUS != 'CANCELED' && slot.BAS_ID === this.USERS['USERS'][i].U_ID).length;
            BA.Other=BA.Other+isOtherBA;
            
            //day['isAvailable']=isAvailable;
            //this.USERS['USERS'][i]['Available']=isAvailable;
            //console.log('THIS USER Specialist', this.USERS['USERS'][i].U_ROLE);
            this.AVAILIBLE=this.AVAILIBLE+isAvailable;
            this.BOOKED=this.BOOKED+isBook + isBookBA;
            this.OTHER=this.OTHER + isOther + isOtherBA;
            this.CANCELED=this.CANCELED + isCancle + isCancleBA;

            this.SLOTS=this.SLOTS + (isAvailable + isBook + isBookBA + isOther + isOtherBA + isCancle + isCancleBA);
          });

          if(this.USERS['USERS'][i].U_ROLE=="Specialist")
            {
              //console.log('THIS USER Specialist');
              this.SPECIALISTS.push(SPECIALIST);
              //console.log('this.SPECIALISTS',this.SPECIALISTS);
            }
            if(this.USERS['USERS'][i].U_ROLE=="BA" || this.USERS['USERS'][i].U_ROLE=="Admin" || this.USERS['USERS'][i].U_ROLE=="Manager")
            {
              this.BAS.push(BA);
            }
          }
        }
        console.log('this.SPECIALISTS',this.SPECIALISTS);
        console.log('this.BA',this.BAS);
        this.loadingService.loadingDissmiss();
      });
  }


  getCalendarMonth(currentYYYYMM:string){
    //this.TODAY = this.calendarService.getTodayString();
    ///this.currentYYYYMM = this.TODAY.substr(0, 6);
    let _35Days1: iDay[] = this.calendarService.create35DaysOfMonth(currentYYYYMM);

    this.loadingService.presentLoading();
   this.monthSubscription = this.crudService.calendarMonthGet(currentYYYYMM)
     .subscribe(data => {
       console.log('calendar',data)
       if (typeof (data) !== 'undefined') {
         
         let newdays = _35Days1.map(day => data[day.DateId]);
         let total_availible=0;
         let total_slot=0;

         for(let i:number =0; i<this.USERS['USERS'].length; i++)
         {
           let SPECIALIST:iUserReport=this.USERS['USERS'][i];
           SPECIALIST.USER=this.USERS['USERS'][i];
           SPECIALIST.Availible=0;
           SPECIALIST.Booked=0;
           SPECIALIST.Other=0;
           SPECIALIST.Canceled=0;

           let BA:iUserReport=this.USERS['USERS'][i];
           BA.USER=this.USERS['USERS'][i];
           BA.Availible=0;
           BA.Booked=0;
           BA.Other=0;
           BA.Canceled=0;
           // if(this.USERS['USERS'][i].U_ROLE=="Specialist")
           // {
           //   this.SPECIALISTS.push(SPECIALIST);
           // }

           newdays.forEach(day => {
             

             //console.log('chay = ',day);
             let n = day.Slots.filter(slot => slot.STATUS !== 'AVAILABLE').length;
             day['n'] = n;
             let isblock=false;     
             if(n>=4)
             {
               let block_ = day.Slots.filter(slot => slot.STATUS === 'BLOCKED').length;
               if(block_ >= 4)
                 isblock=true;
             }
             let isDraft= day.Slots.filter(slot => slot.STATUS === 'DRAFT').length;
             
             day['isdraft']=(isDraft>=1);
             day['isblock']=isblock;
             let isCanceled= day.Slots.filter(slot => slot.STATUS === 'CANCELED').length;
             day['isCancel']=isCanceled;
           
           let isAvailable= day.Slots.filter(slot => slot.STATUS === 'AVAILABLE' && slot.SPE_ID === this.USERS['USERS'][i].U_ID).length;
           SPECIALIST.Availible=SPECIALIST.Availible+isAvailable;
           let isBook= day.Slots.filter(slot => slot.STATUS === 'BOOKED' && slot.BAS_ID === '' &&  slot.SPE_ID === this.USERS['USERS'][i].U_ID).length;
           SPECIALIST.Booked=SPECIALIST.Booked+isBook;
           let isCancle= day.Slots.filter(slot => slot.STATUS === 'CANCELED' && slot.BAS_ID === '' &&  slot.SPE_ID === this.USERS['USERS'][i].U_ID).length;
           SPECIALIST.Canceled=SPECIALIST.Canceled+isCancle;

           let isAvailableBA= day.Slots.filter(slot => slot.STATUS === 'AVAILABLE' && slot.BAS_ID === this.USERS['USERS'][i].U_ID).length;
           BA.Availible=BA.Availible+isAvailableBA;
           let isBookBA= day.Slots.filter(slot => slot.STATUS === 'BOOKED' && slot.BAS_ID === this.USERS['USERS'][i].U_ID).length;
           BA.Booked=BA.Booked+isBookBA;
           let isCancleBA= day.Slots.filter(slot => slot.STATUS === 'CANCELED' &&  slot.BAS_ID === this.USERS['USERS'][i].U_ID).length;
           BA.Canceled=BA.Canceled+isCancleBA;

           let isOther= day.Slots.filter(slot => slot.STATUS != 'AVAILABLE' && slot.STATUS != 'BOOKED' && slot.STATUS != 'CANCELED' && slot.BAS_ID === '' && slot.SPE_ID === this.USERS['USERS'][i].U_ID).length;
           SPECIALIST.Other=SPECIALIST.Other+isOther;

           let isOtherBA= day.Slots.filter(slot => slot.STATUS != 'AVAILABLE' && slot.STATUS != 'BOOKED' && slot.STATUS != 'CANCELED' && slot.BAS_ID === this.USERS['USERS'][i].U_ID).length;
           BA.Other=BA.Other+isOtherBA;
           
           //day['isAvailable']=isAvailable;
           //this.USERS['USERS'][i]['Available']=isAvailable;
           //console.log('THIS USER Specialist', this.USERS['USERS'][i].U_ROLE);
           this.AVAILIBLE=this.AVAILIBLE+isAvailable;
           this.BOOKED=this.BOOKED+isBook + isBookBA;
           this.OTHER=this.OTHER + isOther + isOtherBA;
           this.CANCELED=this.CANCELED + isCancle + isCancleBA;

           this.SLOTS=this.SLOTS + (isAvailable + isBook + isBookBA + isOther + isOtherBA + isCancle + isCancleBA);
         });

         if(this.USERS['USERS'][i].U_ROLE=="Specialist")
           {
             //console.log('THIS USER Specialist');
             this.SPECIALISTS.push(SPECIALIST);
             //console.log('this.SPECIALISTS',this.SPECIALISTS);
           }
           if(this.USERS['USERS'][i].U_ROLE=="BA" || this.USERS['USERS'][i].U_ROLE=="Admin" || this.USERS['USERS'][i].U_ROLE=="Manager")
           {
             this.BAS.push(BA);
           }



         }
       }
       console.log('this.SPECIALISTS',this.SPECIALISTS);
       console.log('this.BA',this.BAS);
       this.loadingService.loadingDissmiss();
     });
 }

  downloadBookingsReport() {
    this.loadingService.presentLoading();
    let BOOKINGS: iBooking[] = [];
    this.crudService.bookingsAllGet().then((res: any) => {
      console.log(res);
      BOOKINGS = res.BOOKINGS;
      this.generateThenDownloadBookingsReport(BOOKINGS, 'BOOKINGS_');
    })
      .catch(err => {
        console.log(err)
        this.loadingService.loadingDissmiss();
      })
  }

  downloadBookingsReportFromTo(FROM: string, TO: string) {
    this.loadingService.presentLoading();
    let BOOKINGS: iBooking[] = [];
    this.crudService.bookingsFromToGet(FROM, TO).then((res: any) => {
      console.log(res);
      BOOKINGS = res.BOOKINGS;
      this.generateThenDownloadBookingsReport(BOOKINGS, 'BOOKINGS_' + FROM + '_' + TO + '_');
    })
      .catch(err => {
        console.log(err)
        this.loadingService.loadingDissmiss();
      })
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
      _BOOKING['MakeUp'] = B.B_MAKEUP ? '1' : '0';
      _BOOKING['Nước hoa'] = B.B_PERFUME ? '1' : '0';
      _BOOKING['Fashion'] = B.B_FASHION ? '1' : '0';
      _BOOKING['Skin Care'] = B.B_CSCU ? '1' : '0';
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

  downloadCustomersReport() {
    let indexCustomer=0;
    let _CUSTOMERS = [];
    //console.log('goi 2 = ',this.CUSTOMERS);
    for(let _customer of this.CUSTOMERS){
      this.countBookingsOfCustomerID(_customer.C_ID, null,indexCustomer);
      this.countBookingsOfCustomerID(_customer.C_ID, "CANCELED",indexCustomer);
      this.countBookingsOfCustomerID(_customer.C_ID, "COMPLETED",indexCustomer);
      indexCustomer++;
    }
    //console.log('dong 120: ',this.CUSTOMERS);
    setTimeout(() => {
      this.CUSTOMERS.forEach(C => {
        let _CUSTOMER = {};
        _CUSTOMER['Tên'] = C.C_NAME;                        
        _CUSTOMER['VIPCODE'] = C.C_VIPCODE;
        _CUSTOMER['SĐT'] = C.C_PHONE;
        _CUSTOMER['Sublimage'] = C.C_SUBLIMAGE ? '1' : '0';
        _CUSTOMER['Le Lift'] = C.C_LELIFT ? '1' : '0';
        _CUSTOMER['Makeup'] = C.C_MAKEUP ? '1' : '0';
        _CUSTOMER['Nước hoa'] = C.C_PERFUME ? '1' : '0';
        _CUSTOMER['Fashion'] = C.C_FASHION ? '1' : '0';
        _CUSTOMER['Skin Care'] = C.C_CSCU ? '1' : '0';
        _CUSTOMER['Đã đặt'] = C.C_SUMBOOK;
        _CUSTOMER['Huỷ bỏ'] = C.C_CANCELED;
        _CUSTOMER['Đã sử dụng'] = C.C_COMPLETED;
        indexCustomer++;
        _CUSTOMERS.push(_CUSTOMER);
      })
    }, 1000);
    
    setTimeout(() => {
      this.excelService.exportFromArrayOfObject2Excel(_CUSTOMERS, 'CUSTOMERS_');
    }, 1500);
  }

   getBookingOfCustomerID(C_ID:string) {
    let BOOKINGS = [];
    this.crudService.bookingsOfCustomerGet(C_ID)
    .subscribe(qSnap => {
      qSnap.forEach(qDocSnap => {
        let BOOKING = <iBooking>qDocSnap.data();
        BOOKINGS.push(BOOKING);
      })
      console.log(BOOKINGS);
    })
    return BOOKINGS;
  }

 countBookingsOfCustomerID(C_ID: string, STATE: string, index: number) {
   let num=0;
   this.crudService.bookingsOfCustomerGet(C_ID)
    .subscribe(qSnap => {
      qSnap.forEach(qDocSnap => {
        let BOOKING = <iBooking>qDocSnap.data();
        if (STATE){
          if(BOOKING.B_STATUS === STATE)
          {
            num++;
          }
        }
        else
        {
          num++;
        }
      })
      if(STATE === null)
        this.CUSTOMERS[index].C_SUMBOOK=num;
      if(STATE === 'CANCELED')
        this.CUSTOMERS[index].C_CANCELED=num;
      if(STATE === 'COMPLETED')
        this.CUSTOMERS[index].C_COMPLETED=num;
    })
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


  ////////////
  downloadSpecialistReports() {
    let indexCustomer=0;
    let _SPECIALISTS = [];
    
    //console.log('dong 120: ',this.CUSTOMERS);
    setTimeout(() => {
      this.SPECIALISTS.forEach(C => {
        let _SPECIALIST = {};
        _SPECIALIST['Họ và tên'] = C.USER.U_FULLNAME;
        _SPECIALIST['SĐT'] = C.USER.U_PHONE;
        _SPECIALIST['EMAIL'] = C.USER.U_EMAIL;
        _SPECIALIST['Quyền'] = C.USER.U_ROLE;
        _SPECIALIST['Trống'] = C.Availible;
        _SPECIALIST['Đã book'] = C.Booked;
        indexCustomer++;
        _SPECIALISTS.push(_SPECIALIST);
      })
    }, 1000);
    
    setTimeout(() => {
      this.excelService.exportFromArrayOfObject2Excel(_SPECIALISTS, 'SPECIALIST_');
    }, 1500);

    //console.log('Customer',_CUSTOMERS);
  }


  downloadBAReports() {
    let indexCustomer=0;
    let _SPECIALISTS = [];
    
    //console.log('dong 120: ',this.CUSTOMERS);
    setTimeout(() => {
      this.BAS.forEach(C => {
        let _SPECIALIST = {};
        _SPECIALIST['Họ và tên'] = C.USER.U_FULLNAME;
        _SPECIALIST['SĐT'] = C.USER.U_PHONE;
        _SPECIALIST['EMAIL'] = C.USER.U_EMAIL;
        _SPECIALIST['Quyền'] = C.USER.U_ROLE;
        _SPECIALIST['Trống'] = C.Availible;
        _SPECIALIST['Đã book'] = C.Booked;
        indexCustomer++;
        _SPECIALISTS.push(_SPECIALIST);
      })
    }, 1000);
    
    setTimeout(() => {
      this.excelService.exportFromArrayOfObject2Excel(_SPECIALISTS, 'BA_');
    }, 1500);

    //console.log('Customer',_CUSTOMERS);
  }
  //////////

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

  selectChooseMonth(D)
  {
    console.log(D)
    let y=D.substr(0, 4);
    let m=D.substr(5, 6);
    this.TODAY=y + m + '01';
    console.log(this.TODAY);
    console.log('loc: ',this.LOCATION);
    this.getCalendar(this.TODAY, this.MONTHOPTION);
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
      this.CUSTOMERSVIEW = this.CUSTOMERS_.filter(CUS => CUS.C_PHONE.toLowerCase().indexOf(str) > -1 || CUS.C_NAME.toLowerCase().indexOf(str) > -1 || CUS.C_VIPCODE.toLowerCase().indexOf(str) > -1)
    } else {
      console.log('str = 0');
      this.CUSTOMERSVIEW = [];
    }
  }

  getAllBookingOfCustomer(CUSTOMER: iCustomer) {
    this.loadingService.presentLoading();
    console.log(CUSTOMER);
    this.crudService.bookingsOfCustomerGet(CUSTOMER.C_ID)
      .subscribe(qSnap => {
        let BOOKINGS = [];
        qSnap.forEach(qDocSnap => {
          let BOOKING = <iBooking>qDocSnap.data();
          BOOKINGS.push(BOOKING);
        })
        console.log(BOOKINGS);
        //this.generateThenDownloadBookingsReport(BOOKINGS, CUSTOMER.C_NAME);
        console.log('hien thi popup list booking');
      })
  }
  async showAllBookingOfCustomers(CUSTOMERS_ALL: iCustomer[]) {
    this.loadingService.presentLoading();
    console.log(CUSTOMERS_ALL);
    let BOOKINGS = [];
    for(let _customer of CUSTOMERS_ALL){
      this.crudService.bookingsOfCustomerGet(_customer.C_ID)
      .subscribe(qSnap => {
        //let BOOKINGS = [];
        qSnap.forEach(qDocSnap => {
          let BOOKING = <iBooking>qDocSnap.data();
          BOOKINGS.push(BOOKING);
        })
        //console.log(BOOKINGS);
        //this.generateThenDownloadBookingsReport(BOOKINGS, CUSTOMER.C_NAME);
        //console.log('hien thi popup list booking');
      })
    }
    this.showHistoryBooking(BOOKINGS);
  }

  async showAllBookingOfCustomer(CUSTOMER: iCustomer) {
    this.loadingService.presentLoading();
    console.log(CUSTOMER);
    //let BOOKINGS = [];
    this.crudService.bookingsOfCustomerGet(CUSTOMER.C_ID)
      .subscribe(qSnap => {
        let BOOKINGS = [];
        qSnap.forEach(qDocSnap => {
          let BOOKING = <iBooking>qDocSnap.data();
          BOOKINGS.push(BOOKING);
        })
        //console.log(BOOKINGS);
        //this.generateThenDownloadBookingsReport(BOOKINGS, CUSTOMER.C_NAME);
        //console.log('hien thi popup list booking');
        this.showHistoryBooking(BOOKINGS);
      }) 
  }

  async showHistoryBooking(BOOKINGS:any) {
    console.log('chạy vào đây');
    const modal = await this.modalController.create({
      component: ReportShowHistoryPage,
      componentProps: { BOOKINGS: BOOKINGS }
    });
    await modal.present();
    const data = await modal.onDidDismiss();
    console.log(data);
  }

}
