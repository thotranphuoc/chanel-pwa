import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { iUser } from '../interfaces/user.interface';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
  data: any;
  BAs: iUser[] = [];
  BAs_: iUser[] = [];
  filteredBAs: iUser[] = [];
  selectedBA: iUser = null;
  constructor(
    public modalController: ModalController,
    private navPar: NavParams,
  ) {
    this.data = this.navPar.data;
    this.BAs = this.data.BAs;
    console.log(this.BAs);
    this.BAs_ = this.BAs.slice(0);
    this.filteredBAs = this.BAs.slice(0);
   }

  ngOnInit() {
  }

  search(e: string){
    console.log(e);
    let str = e.toLowerCase();
    console.log(str);
    if(str.length>0){
      this.filteredBAs = this.BAs.filter(USER => USER.U_FULLNAME.toLowerCase().indexOf(str)>-1 || USER.U_PHONE.toLowerCase().indexOf(str)>-1)
    }else{
      console.log('str = 0');
      this.filteredBAs = this.BAs_; 
    }
    console.log(this.filteredBAs);
  }

  selectBA(USER: iUser){
    console.log(USER);
    this.selectedBA = USER;
    this.doCancel();
  }

  doCancel() {
    // this.modalController.dismiss();
    this.modalController.getTop()
      .then(res => {
        console.log(res);
        if (typeof (res) !== 'undefined') res.dismiss({ selectedBA: this.selectedBA });
      })
      .catch(err => { console.log(err) });
  }

}
