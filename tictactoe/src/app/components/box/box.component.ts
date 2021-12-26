import { Component, OnInit,Input } from '@angular/core';

@Component({
  selector: 'app-box',
  templateUrl: './box.component.html',
  styleUrls: ['./box.component.css']
})
export class BoxComponent implements OnInit {

  @Input() value:string;
  
  constructor() {
    this.value="";
  }

  ngOnInit(): void { 
  }

  getValue(){
    return this.value;
  }

  setValue(v:string){
    this.value=v;
  }

}
