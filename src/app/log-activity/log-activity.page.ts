import { Component, OnInit } from '@angular/core';
import { DbService } from '../services/db.service';

@Component({
  selector: 'app-log-activity',
  templateUrl: './log-activity.page.html',
  styleUrls: ['./log-activity.page.scss'],
})
export class LogActivityPage implements OnInit{
  HISTORYS:any = [];
  HISTORYS_:any = [];
  constructor(
    private dbService: DbService,
  ) { 
  }

  ngOnInit() {
    this.getHistory();
  }

  getHistory(){
    this.dbService.getHistory()
    .subscribe((result)=>{
      this.HISTORYS = result;
      this.HISTORYS_ = result;
      console.log(result);
    })
  }

  search(e){
    console.log(e);
    let str = e.toLowerCase();
    console.log(str);
    if(str.length>0){
      this.HISTORYS = this.HISTORYS.filter(HIC => HIC.ACTIVITY.toLowerCase().indexOf(str)>-1)
    }else{
      console.log('str = 0');
      this.HISTORYS = this.HISTORYS_; 
    }
  }

}
