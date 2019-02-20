import { Component, OnInit } from '@angular/core';
import { Papa } from 'ngx-papaparse';
@Component({
  selector: 'app-calendar-upload',
  templateUrl: './calendar-upload.page.html',
  styleUrls: ['./calendar-upload.page.scss'],
})
export class CalendarUploadPage implements OnInit {

  constructor(
    private papa: Papa
  ) { }

  ngOnInit() {
  }
  parse(files: FileList): void {
    const file: File = files.item(0);
    console.log(files);
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.onload = e => {
      let csv = reader.result;
      //console.log(csv);
      this.papa.parse(String(csv), {
        header: true,
        complete: function (results) {
          console.log(results);
        }
      });
    }
  }
}
