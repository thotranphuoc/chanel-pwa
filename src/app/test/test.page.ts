import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-test',
  templateUrl: './test.page.html',
  styleUrls: ['./test.page.scss'],
})
export class TestPage implements OnInit {
  ITEMS = [
    { date: '1', nums: [1, 2, 3, 4, 5, 4] },
    { date: '2', nums: [1, 2, 3, 4,] },
    { date: '3', nums: [1, 2, 3, 4, 5, 6, 7, 8] },
    { date: '4', nums: [1, 2, 3, 4, 5, 4, 7, 5] },
    { date: '5', nums: [1, 2, 3, 4, 5, 4, 5, 4] },
    { date: '6', nums: [1, 2, 3, 4, 5, 4, 5, 4] },
    { date: '7', nums: [1, 2, 3, 4, 5, 4, 6, 4] },
    { date: '8', nums: [1, 2, 3,] }
  ]
  constructor() { }

  ngOnInit() {
    console.log(2 / 3);
    console.log(4 / 3);
    console.log(5 % 3);
    console.log(Math.ceil(4 / 4));
    console.log(Math.ceil(3 / 4));
    console.log(Math.ceil(6 / 4));
    console.log(Math.ceil(8 / 4));
    console.log(Math.ceil(9 / 4));

    let arr = [1, 2, 3, 4, 5, 4, 6];
    let newArr = this.splitIntoSubArray(arr, 4);
    console.log(newArr);
  }


  splitIntoSubArray(arr, count) {
    var newArray = [];
    while (arr.length > 0) {
      newArray.push(arr.splice(0, count));
    }
    return newArray;
  }

}
