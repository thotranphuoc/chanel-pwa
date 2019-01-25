import { Component, OnInit } from '@angular/core';
import { ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
  encapsulation: ViewEncapsulation.Emulated
})
export class AboutPage implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
