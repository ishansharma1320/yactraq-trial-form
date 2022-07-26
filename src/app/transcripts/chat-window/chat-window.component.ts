import { Component, Input, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';



// interface WERElement {
//   error_type: string;
//   count: number;
//   // words: string;
// }


@Component({
  selector: 'app-chat-window',
  templateUrl: './chat-window.component.html',
  styleUrls: ['./chat-window.component.css']
})
export class ChatWindowComponent implements OnInit {
  @Input() conversation: any;
  displayedColumns = [
    'error_type',
    'count',
    'words'
  ];
  @Input() dataSource: any;
  constructor(private appService: AppService) {
    
   }


  ngOnInit(): void {
    console.log(this.conversation);
      }

}
