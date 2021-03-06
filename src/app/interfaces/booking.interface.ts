import { iUser } from '../interfaces/user.interface';
import { iCustomer } from '../interfaces/customer.interface';
import { iFacialCabin } from './facialcabin.interface';
import { iDay } from './day.interface';
import { iEvent } from './event.interface';

export interface iBooking {
    B_ID: string,
    B_CUSTOMER_NAME: string,
    B_CUSTOMER_VIPCODE: string,
    B_CUSTOMER_PHONE: string,
    B_CUSTOMER_ID: string,
    B_CUSTOMER: iCustomer,
    B_DAY: iDay;
    B_FACIAL: iFacialCabin,
    B_FACIAL_ID: string,
    B_FACIAL_NAME: string,
    B_MANAGER: iUser,
    B_MANAGER_ID: string,
    B_MANAGER_NAME: string,
    B_SLOT: string,
    B_DATE: string,
    B_FHOUR: string,
    B_THOUR: string,
    B_isNewCustomer: boolean,
    B_PERFUME: boolean,
    B_MAKEUP: boolean,
    B_CSCU: boolean,
    B_SUBLIMAGE: boolean,
    B_SUBLIMAGES: string,
    B_LELIFT: boolean,
    B_FASHION: boolean,
    B_FASHIONS: string,
    // B_1stTIME: boolean,
    B_NOTE: string,
    B_STATUS: string,
    B_STATUS_VI: string,
    B_CREATED_TIME: string,
    B_TOTAL: number,
    B_SPECIALIST: iUser,
    B_SPECIALIST_ID: string,
    B_SPECIALIST_NAME: string,
    B_BA_BOOK: iUser,
    B_BA_BOOK_ID: string,
    B_BA_BOOK_NAME: string,
    B_BA_SELL: iUser,
    B_BA_SELL_ID: string,
    B_BA_SELL_NAME: string,
    B_SVC_BOOK: number,
    B_SVC_USE: number,
    B_SVC_CANCEL: number,
    B_MEMOS: string,
    B_TILL: string,
    B_OTHER: any,
    B_CANCELED_BY_USER: iUser,
    B_EVENTS: iEvent[],
    


}