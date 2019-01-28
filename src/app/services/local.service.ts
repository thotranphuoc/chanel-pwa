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
  USER: iUser=null;
  USER_DEFAULT: iUser = {
    U_FNAME: '',
    U_LNAME: '',
    U_EMAIL: '',
    U_PHONE: '',
    U_DoB: '',
    U_GENDER: '',
    U_ADDRESS: '',
    U_ROLE: '',
    U_ID: '',
    U_AVATAR:'',
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
CUSTOMER : iCustomer = null;
CUSTOMER_DEFAULT: iCustomer = {
  C_FNAME: '',
  C_LNAME: '',
  C_EMAIL: '',
  C_PHONE: '',
  C_ID: '1',
  C_VIPCODE: '',
  C_AVATAR:'',
}

////////////////////////////////
FACIALCABIN : iFacialCabin = null;
FACIALCABIN_DEFAULT: iFacialCabin = {
  F_LOCATION: '',
  F_MANAGER: '',
  F_NAME: '',
  F_ID: '1',
}

///////////////BOOKING/////////////////
IFACIAL: iFacial=null;
IFACIAL_DEFAULT: iFacial = {
  F_SKIN: 'false',
  F_SUBLIMAGE: 'false',
  F_SUBPRODUCT: null,
  F_LELIFTCUSTOMER: 'false',
  F_FASHIONCUSTOMER: 'false',
  F_FASHIONPRODUCT: null,
  F_FIRSTTIME: 'false',
}


BOOKING : iBooking = null;
BOOKING_DEFAULT: iBooking = {
    B_CUSTOMER: this.CUSTOMER,
    B_FACIAL: this.IFACIAL,
    B_FDATE: '',
    B_FHOUR: '',
    B_ID: '',
    B_STAFF: this.USER_DEFAULT,
    B_STATUS:'',
    B_TDATE: '',
    B_THOUR: '',
    B_TIME: '',
    B_NOTE: ''
}



}
