import { iSlot } from "./slot.interface";

export interface iDay {
    Date: string,
    DateId: string,
    Slots: iSlot[],
    date: string,
    isThePast: boolean,
    isDraff:boolean,
}