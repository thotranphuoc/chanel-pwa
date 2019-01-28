import { Component, OnInit } from '@angular/core';
import {iFacialCabin} from '../interfaces/facialcabin.interface';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { CrudService } from '../services/crud.service';
import { LocalService } from '../services/local.service';

@Component({
  selector: 'app-facial-cabin-list',
  templateUrl: './facial-cabin-list.page.html',
  styleUrls: ['./facial-cabin-list.page.scss'],
})
export class FacialCabinListPage implements OnInit {
FACIALCABINS:any=[];
  constructor(
    private navCtrl: NavController,
    private authService: AuthService,
    private crudService: CrudService,
    private localService: LocalService,
  ) { }

  ngOnInit() {
    this.getFacialCabin();
  }

  getFacialCabin(){
    this.authService.getFacialCabin()
    .then((qSnap) => {
      let results = [];
      if (qSnap.size > 0) {
          qSnap.forEach(doc => {
              if (doc.exists) {
                  let result = <iFacialCabin>doc.data();
                  results.push(result);
              }
          });
          console.log(results);
              //resolve({ CUSTOMERS: results });
          } else {
              //resolve({ CUSTOMERS: results });
          }

          this.FACIALCABINS=results;
      })  
      .catch((err) => {
        console.log(err);
      })
    }


  go2FacialCabinEdit(facialcabin: iFacialCabin){
    console.log('edit');
    this.localService.FACIALCABIN = facialcabin;
    this.navCtrl.navigateForward('/facial-cabin-edit');
}

addNew(){
  
}

}
