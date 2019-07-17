export interface iCustomer {
    C_NAME: string,
    C_EMAIL: string,
    C_PHONE: string,
    C_VIPCODE: string,
    C_ID: string,
    C_AVATAR: string,
    C_LAST_B_ID: string,
    C_LAST_B_DATE: string,
    C_LAST_B_SLOT: string,
    C_isSUBLIMAGE: boolean,
    C_LASTUSE_SUBLIMAGE: string,
    C_BOOKINGS: {},
    C_BOOK_STATE: string,
    C_PERFUME: boolean,
    C_MAKEUP: boolean,
    C_CSCU: boolean,
    C_SUBLIMAGE: boolean,
    C_SUBLIMAGES: string,
    C_LELIFT: boolean,
    C_FASHION: boolean,
    C_FASHIONS: string,
    C_NOTE: string,
    C_isNewCustomer: boolean,
    C_SUMBOOK?:number,
    C_CANCELED?:number,
    C_COMPLETED?:number
}

// C_BOOKINGS: {
//     BOOKING_ID1: {
//         ID: 'dsd',
//         STATE: 'COMPLETED'
//     },
//     BOOKING_ID2: {
//         ID: 'dsd',
//         STATE: 'CANCELED'
//     },
// }