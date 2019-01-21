import { Injectable } from '@angular/core';
import { iProfile } from '../interfaces/profile.interface';
import { iUser } from '../interfaces/user.interface';
import { iCustomer } from '../interfaces/customer.interface';
@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor() { }
  PROFILE_DEFAULT: iProfile = null;
  

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


}
