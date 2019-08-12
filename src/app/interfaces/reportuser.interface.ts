import { iUser } from "./user.interface";
export interface iUserReport {
    USER:iUser,
    Availible: number,
    Booked: Number,
    Canceled: Number,
    Other:Number,
  }