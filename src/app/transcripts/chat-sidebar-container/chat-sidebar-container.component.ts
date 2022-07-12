import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-chat-sidebar-container',
  templateUrl: './chat-sidebar-container.component.html',
  styleUrls: ['./chat-sidebar-container.component.css']
})
export class ChatSidebarContainerComponent implements OnInit {
  @Input() uid: string;  
  @Input() callId: string;
  @Input() accountId: string;
  @Input() engine: string;
  @Input() selected: boolean;
  @Output() conversationClicked: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
  onClickSidebar(uid: string){
    this.conversationClicked.emit(uid);
  }
}
