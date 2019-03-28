import { Injectable } from '@angular/core';
import * as FileSaver from 'file-saver';
import * as Excel from 'xlsx';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }
  exportFromArrayOfObject2Excel(ARR: any[], name: string) {
    let finalArray = [];
    ARR.forEach(item => {
      let _item = this.convertObject2FlattenObject(item);
      finalArray.push(_item);
    })
    this.exportAsExcelFile(finalArray, name);
  }
  private exportAsExcelFile(json: any[], excelFileName: string) {
    const worksheet: Excel.WorkSheet = Excel.utils.json_to_sheet(json);
    const workbook: Excel.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    const excelBuffer: any = Excel.write(workbook, { bookType: 'xlsx', type: 'array' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  private saveAsExcelFile(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);

  }

  private convertObject2FlattenObject(Obj: Object) {
    let depth = this.getDepthOfObject(Obj);
    let newObj = Obj;
    for (let index = 1; index < depth; index++) {
      let _result = this.flattenObject(newObj);
      newObj = { ..._result };
    }
    return newObj;
  }

  private flattenObject(O: Object) {
    let KEYS = Object.keys(O);
    KEYS.forEach(KEY => {
      if (typeof (O[KEY]) === 'object') {
        Object.assign(O, O[KEY]);
        delete O[KEY];
      }
    })
    console.log(O);
    return O;
  }

  private getDepthOfObject(O: Object) {
    var level = 1;
    var key: string;
    for (key in O) {
      // console.log(key);
      if (!O.hasOwnProperty(key)) continue;
      if (typeof O[key] == 'object') {
        var depth = this.getDepthOfObject(O[key]) + 1;
        console.log(depth, level);
        level = Math.max(depth, level);
      }
    }
    return level;
  }
}
