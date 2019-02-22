import { Component, OnInit } from '@angular/core';
import {iFacialCabin} from '../interfaces/facialcabin.interface'
import { LocalService } from '../services/local.service';
import { CrudService } from '../services/crud.service';

@Component({
  selector: 'app-facial-cabin-edit',
  templateUrl: './facial-cabin-edit.page.html',
  styleUrls: ['./facial-cabin-edit.page.scss'],
})
export class FacialCabinEditPage implements OnInit {

  FACIALCABIN: iFacialCabin;
  ALERTUPDATE: string = '';
  constructor(
      private localService: LocalService,
      private crudService: CrudService,
  ) { }

  ngOnInit() {
    this.FACIALCABIN=this.localService.FACIALCABIN;
  }


  addEdit(fmanager:string, fname:string, flocation:string){
    this.FACIALCABIN.F_MANAGER = fmanager;
    this.FACIALCABIN.F_NAME = fname;
    this.FACIALCABIN.F_LOCATION = flocation;

    
    this.crudService.updateFacialCabin(this.FACIALCABIN)
    .then((res: any) => {
      console.log(res);
      //this.presentToast("thanh cong");
      this.ALERTUPDATE='Cập nhật thành công';
    })
    .catch((err) => {
      console.log(err);
      this.ALERTUPDATE='Cập nhật thất bại';
    })

  }

}
