import { iUser } from '../interfaces/user.interface';
import { iCustomer } from '../interfaces/customer.interface';
import { iFacial} from '../interfaces/ifacial.interface';

export interface iBooking{
    B_CUSTOMER: iCustomer,
    B_FACIAL: iFacial,
    B_FDATE: string,
    B_FHOUR: string,
    B_ID: string,
    B_STAFF: iUser,
    B_STATUS:string,
    B_TDATE: string,
    B_THOUR: string,
    B_TIME:string,
    B_NOTE: string
}