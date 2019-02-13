import { Injectable } from '@angular/core';
import { iProfile } from '../interfaces/profile.interface';
import { iUser } from '../interfaces/user.interface';
import { iCustomer } from '../interfaces/customer.interface';
import { iFacialCabin } from '../interfaces/facialcabin.interface';
import { iFacial } from '../interfaces/ifacial.interface';
import { iBooking } from '../interfaces/booking.interface';
@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }
  PROFILE_DEFAULT: iProfile = null;
  FBUSER: any;
  USER: iUser = null;
  USER_DEFAULT: iUser = {
    U_NAME: '',
    U_EMAIL: '',
    U_PHONE: '',
    U_DoB: '',
    U_GENDER: '',
    U_ADDRESS: '',
    U_ROLE: '',
    U_ID: '',
    U_AVATAR: '',
    U_STATE: ''
  }

  ACCOUNT = {
    email: '',
    pass: '',
    isSigned: false,
    id: '',
    profile: this.PROFILE_DEFAULT,
    currentUser: null
  }

  ACCOUNT_INIT = {
    email: '',
    pass: '',
    isSigned: false,
    id: '',
    profile: this.PROFILE_DEFAULT,
    currentUser: null
  }

  ////////////////////////////////
  CUSTOMER: iCustomer = null;
  CUSTOMER_DEFAULT: iCustomer = {
    C_NAME: '',
    C_EMAIL: '',
    C_PHONE: '',
    C_ID: '1',
    C_VIPCODE: '',
    C_AVATAR: '',
  }

  ////////////////////////////////
  FACIALCABIN: iFacialCabin = null;
  FACIALCABIN_DEFAULT: iFacialCabin = {
    F_LOCATION: '',
    F_MANAGER: '',
    F_NAME: '',
    F_ID: '1',
  }

  ///////////////BOOKING/////////////////
  FACIAL: iFacial = null;
  FACIAL_DEFAULT: iFacial = {
    F_SKIN: 'false',
    F_SUBLIMAGE: 'false',
    F_SUBPRODUCT: null,
    F_LELIFTCUSTOMER: 'false',
    F_FASHIONCUSTOMER: 'false',
    F_FASHIONPRODUCT: null,
    F_FIRSTTIME: 'false',
  }


  BOOKING: iBooking = null;
  BOOKING_DEFAULT: iBooking = {
    B_ID: '',
    B_CUSTOMER_NAME: '',
    B_CUSTOMER_VIPCODE: '',
    B_CUSTOMER_PHONE: '',
    B_CUSTOMER_ID: '',
    B_CUSTOMER: this.CUSTOMER_DEFAULT,
    B_FACIAL: this.FACIALCABIN_DEFAULT,
    B_FACIAL_ID: '',
    B_FACIAL_NAME: '',
    B_MANAGER: this.USER_DEFAULT,
    B_MANAGER_ID: '',
    B_MANAGER_NAME: '',
    B_SLOT: '',
    B_DATE: '',
    B_FHOUR: '',
    B_THOUR: '',
    B_isNewCustomer: false,
    B_CSCU: false,
    B_SUBLIMAGE: false,
    B_SUBLIMAGES: '',
    B_LELIFT: false,
    B_FASHION: false,
    B_FASHIONS: '',
    B_NOTE: '',
    B_STATUS: '',
    B_CREATED_TIME: '',
    B_TOTAL: null,
    B_SPECIALIST: this.USER_DEFAULT,
    B_SPECIALIST_ID: '',
    B_SPECIALIST_NAME: '',
    B_BA_BOOK: this.USER_DEFAULT,
    B_BA_BOOK_ID: '',
    B_BA_BOOK_NAME: '',
    B_BA_SELL: this.USER_DEFAULT,
    B_BA_SELL_ID: '',
    B_BA_SELL_NAME: '',
    B_SVC_BOOK: 0,
    B_SVC_USE: 0,
    B_SVC_CANCEL: 0,
    B_OTHER: {}
  }



}
