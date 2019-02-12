import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SetgetService {
  OBJ: any;
  constructor() { }

  getPar() {
    return this.OBJ;
  }

  setPar(Par: any) {
    this.OBJ = Par;
  }
}
