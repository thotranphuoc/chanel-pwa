import { Component, OnInit } from '@angular/core';
import { iFacialCabin } from '../interfaces/facialcabin.interface';
import { CrudService } from '../services/crud.service';
import { LocalService } from '../services/local.service';

@Component({
  selector: 'app-facial-cabin-add',
  templateUrl: './facial-cabin-add.page.html',
  styleUrls: ['./facial-cabin-add.page.scss'],
})
export class FacialCabinAddPage implements OnInit {
FACIALCABIN: iFacialCabin;
ALERTADD: string = '';
  constructor(
    private crudService: CrudService,
    private localService: LocalService
  ) { 
    this.FACIALCABIN=localService.FACIALCABIN_DEFAULT;
  }

  ngOnInit() {
  }

  addNew(location:string, manager:string,name:string){

        this.FACIALCABIN.F_LOCATION = location;
        this.FACIALCABIN.F_MANAGER = manager;
        this.FACIALCABIN.F_NAME = name;
    
    this.crudService.createFacialCabin(this.FACIALCABIN)
      .then((res: any) => {
        console.log(res);
        this.ALERTADD='Add new customer success';
      })
      .catch((err) => {
        console.log(err);
        this.ALERTADD='Add new customer fail';
      })
  }

}
