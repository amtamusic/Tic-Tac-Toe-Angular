import { Component, OnInit } from '@angular/core';
import { range } from 'rxjs';
import { Space } from 'src/app/classes/game/space';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {

  boxes:Array<Space>;

  constructor() {
    this.boxes=new Array<Space>();
    for(let i=0;i<9;i++)
    {
      this.boxes.push(new Space("block_"+i,"-"));
      console.log(this.boxes[i].className);
    }
  }

  ngOnInit(): void {
  }

}
