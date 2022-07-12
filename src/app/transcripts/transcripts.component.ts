import { Component, OnInit } from '@angular/core';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';

const DOWNLOAD_ICON =
  `
  <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 322.1 322.1" style="enable-background:new 0 0 322.1 322.1;" xml:space="preserve">
<g transform="translate(0 -562.36)">
	<g>
		<g>
			<path d="M258.9,611.16H210c-18.9,0-18.9,28.4,0,28.4h34.6v216.9H76.8v-216.9H112c18.9,0,18.9-28.4,0-28.4H63.2v0.1l0,0
				c-7.9,0-14.2,6.3-14.2,14.2v245.3c0,7.4,6.3,13.7,14.2,13.7h195.7c7.9,0,14.2-6.3,14.2-13.7v-245.4
				C273.1,617.46,266.8,611.16,258.9,611.16z"/>
			<path d="M147.2,784.06l-25.2-24.7c-2.6-2.6-6.3-4.2-10-4.2c-12.6,0-18.9,15.2-10,23.6l48.8,49.4c5.8,5.3,14.7,5.3,19.9,0
				l48.8-49.4c13.6-13.1-6.3-33.1-19.4-19.4l-25.2,24.7v-207.5c0.1-7.9-6.2-14.2-14.1-14.2v0c-7.9,0-14.2,6.3-13.6,14.2V784.06z"/>
		</g>
	</g>
</g>
</svg>
`;
const CHAT_ICON = `
<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve">
<g>
	<g>
		<g>
			<path d="M418.645,21.333H221.355c-41.173,0-75.776,26.944-88.171,64h157.461c75.008,0,136.021,61.013,136.021,136.021v77.312
				h8.448c47.424,0,76.885-36.501,76.885-95.296v-88.683C512,63.211,470.123,21.333,418.645,21.333z"/>
			<path d="M290.645,128H93.355C41.877,128,0,169.877,0,221.355v88.683c0,58.795,29.461,95.296,76.885,95.296h8.448v64
				c0,10.048,6.997,18.709,16.811,20.843c1.515,0.341,3.029,0.491,4.523,0.491c8.235,0,15.893-4.757,19.413-12.48
				c17.963-39.445,62.592-65.621,76.16-72.853h75.093c49.323,0,106.667-41.621,106.667-95.296v-88.683
				C384,169.877,342.123,128,290.645,128z M106.667,277.333c-11.776,0-21.333-9.557-21.333-21.333s9.557-21.333,21.333-21.333
				S128,244.224,128,256S118.443,277.333,106.667,277.333z M192,277.333c-11.776,0-21.333-9.557-21.333-21.333
				s9.557-21.333,21.333-21.333s21.333,9.557,21.333,21.333S203.776,277.333,192,277.333z M277.333,277.333
				C265.557,277.333,256,267.776,256,256s9.557-21.333,21.333-21.333s21.333,9.557,21.333,21.333S289.109,277.333,277.333,277.333z"
				/>
		</g>
	</g>
</g>
</svg>

`;
const SEARCH_ICON = `<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
viewBox="0 0 487.95 487.95" style="enable-background:new 0 0 487.95 487.95;" xml:space="preserve">
<g>
<g>
 <path d="M481.8,453l-140-140.1c27.6-33.1,44.2-75.4,44.2-121.6C386,85.9,299.5,0.2,193.1,0.2S0,86,0,191.4s86.5,191.1,192.9,191.1
   c45.2,0,86.8-15.5,119.8-41.4l140.5,140.5c8.2,8.2,20.4,8.2,28.6,0C490,473.4,490,461.2,481.8,453z M41,191.4
   c0-82.8,68.2-150.1,151.9-150.1s151.9,67.3,151.9,150.1s-68.2,150.1-151.9,150.1S41,274.1,41,191.4z"/>
</g>
</g>
</svg>
`;

const ADD_ICON = `
<svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
	 width="400px" height="400px" viewBox="0 0 400 400" style="enable-background:new 0 0 400 400;" xml:space="preserve">
<g>
	<g>
		<path d="M199.995,0C89.716,0,0,89.72,0,200c0,110.279,89.716,200,199.995,200C310.277,400,400,310.279,400,200
			C400,89.72,310.277,0,199.995,0z M199.995,373.77C104.182,373.77,26.23,295.816,26.23,200c0-95.817,77.951-173.77,173.765-173.77
			c95.817,0,173.772,77.953,173.772,173.77C373.769,295.816,295.812,373.77,199.995,373.77z"/>
		<path d="M279.478,186.884h-66.363V120.52c0-7.243-5.872-13.115-13.115-13.115s-13.115,5.873-13.115,13.115v66.368h-66.361
			c-7.242,0-13.115,5.873-13.115,13.115c0,7.243,5.873,13.115,13.115,13.115h66.358v66.362c0,7.242,5.872,13.114,13.115,13.114
			c7.242,0,13.115-5.872,13.115-13.114v-66.365h66.367c7.241,0,13.114-5.873,13.114-13.115
			C292.593,192.757,286.72,186.884,279.478,186.884z"/>
	</g>
</g>
</svg>
`;
@Component({
  selector: 'app-transcripts',
  templateUrl: './transcripts.component.html',
  styleUrls: ['./transcripts.component.css']
})
export class TranscriptsComponent implements OnInit {
  conversation = null;
  conversations = [
    {
      id: '1',
      call_id: '6123456',
      account_id: 'Hotstar',
      engine: 'Basic',
      selected: false,
      transcript: [
        { id: 1, body: 'Hello world', speaker:'left'},
        { id: 2, body: 'How are you?', speaker:'right'},
        { id: 3, body: 'I am fine thanks',speaker:'left'},
        { id: 4, body: 'Glad to hear that',speaker:'right'},
      ],
    },
    {
      id: '2',
      call_id: '6123456',
      account_id: 'Hotstar',
      engine: 'Basic Plus',
      selected: false,
      transcript: [
        { id: 1, body: 'Hello world', speaker:'left'},
        { id: 2, body: 'How are you?', speaker:'right'},
        { id: 3, body: 'I am fine thanks',speaker:'left'},
        { id: 4, body: 'Glad to hear that',speaker:'right'},
      ],
    },
    {
      id: '3', //Object ID
      call_id: '6123456',
      account_id: 'Hotstar',
      engine: 'Advanced',
      selected: false,
      transcript: [
        { id: 1, body: 'Hello world', speaker:'left'},
        { id: 2, body: 'How are you?', speaker:'right'},
        { id: 3, body: 'I am fine thanks',speaker:'left'},
        { id: 4, body: 'Glad to hear that',speaker:'right'},
      ],
    },
    {
      id: '4',
      call_id: '6123456',
      account_id: 'Hotstar',
      engine: 'Basic',
      selected: false,
      transcript: [
        { id: 1, body: 'Hello world', speaker:'left'},
        { id: 2, body: 'How are you?', speaker:'right'},
        { id: 3, body: 'I am fine thanks',speaker:'left'},
        { id: 4, body: 'Glad to hear that',speaker:'right'},
      ],
    },
    {
      id: '5',
      call_id: '6123456',
      account_id: 'Hotstar',
      engine: 'Basic Plus',
      selected: false,
      transcript: [
        { id: 1, body: 'Hello world', speaker:'left'},
        { id: 2, body: 'How are you?', speaker:'right'},
        { id: 3, body: 'I am fine thanks',speaker:'left'},
        { id: 4, body: 'Glad to hear that',speaker:'right'},
      ],
    },
    {
      id: '6', //Object ID
      call_id: '6123456',
      account_id: 'Hotstar',
      engine: 'Advanced',
      selected: false,
      transcript: [
        { id: 1, body: 'Hello world', speaker:'left'},
        { id: 2, body: 'How are you?', speaker:'right'},
        { id: 3, body: 'I am fine thanks',speaker:'left'},
        { id: 4, body: 'Glad to hear that',speaker:'right'},
      ]
    },
    {
      id: '7',
      call_id: '6123456',
      account_id: 'Hotstar',
      engine: 'Basic',
      selected: false,
      transcript: [
        { id: 1, body: 'Hello world', speaker:'left'},
        { id: 2, body: 'How are you?', speaker:'right'},
        { id: 3, body: 'I am fine thanks',speaker:'left'},
        { id: 4, body: 'Glad to hear that',speaker:'right'},
      ],
    },
    {
      id: '8',
      call_id: '6123456',
      account_id: 'Hotstar',
      engine: 'Basic Plus',
      selected: false,
      transcript: [
        { id: 1, body: 'Hello world', speaker:'left'},
        { id: 2, body: 'How are you?', speaker:'right'},
        { id: 3, body: 'I am fine thanks',speaker:'left'},
        { id: 4, body: 'Glad to hear that',speaker:'right'},
      ],
    },
    {
      id: '9', //Object ID
      call_id: '6123456',
      account_id: 'Hotstar',
      engine: 'Advanced',
      selected: false,
      transcript: [
        { id: 1, body: 'Hello world', speaker:'left'},
        { id: 2, body: 'How are you?', speaker:'right'},
        { id: 3, body: 'I am fine thanks',speaker:'left'},
        { id: 4, body: 'Glad to hear that',speaker:'right'},
      ]
    },
    {
      id: '10',
      call_id: '6123456',
      account_id: 'Hotstar',
      engine: 'Basic',
      selected: false,
      transcript: [
        { id: 1, body: 'Hello world', speaker:'left'},
        { id: 2, body: 'How are you?', speaker:'right'},
        { id: 3, body: 'I am fine thanks',speaker:'left'},
        { id: 4, body: 'Glad to hear that',speaker:'right'},
      ],
    },
    {
      id: '11',
      call_id: '6123456',
      account_id: 'Hotstar',
      engine: 'Basic Plus',
      selected: false,
      transcript: [
        { id: 1, body: 'Hello world', speaker:'left'},
        { id: 2, body: 'How are you?', speaker:'right'},
        { id: 3, body: 'I am fine thanks',speaker:'left'},
        { id: 4, body: 'Glad to hear that',speaker:'right'},
      ],
    },
    {
      id: '12', //Object ID
      call_id: '6123456',
      account_id: 'Hotstar',
      engine: 'Advanced',
      selected: false,
      transcript: [
        { id: 1, body: 'Hello world', speaker:'left'},
        { id: 2, body: 'How are you?', speaker:'right'},
        { id: 3, body: 'I am fine thanks',speaker:'left'},
        { id: 4, body: 'Glad to hear that',speaker:'right'},
      ]
    },
    {
      id: '1',
      call_id: '6123456',
      account_id: 'Hotstar',
      engine: 'Basic',
      selected: false,
      transcript: [
        { id: 1, body: 'Hello world', speaker:'left'},
        { id: 2, body: 'How are you?', speaker:'right'},
        { id: 3, body: 'I am fine thanks',speaker:'left'},
        { id: 4, body: 'Glad to hear that',speaker:'right'},
      ],
    },
    {
      id: '2',
      call_id: '6123456',
      account_id: 'Hotstar',
      engine: 'Basic Plus',
      selected: false,
      transcript: [
        { id: 1, body: 'Hello world', speaker:'left'},
        { id: 2, body: 'How are you?', speaker:'right'},
        { id: 3, body: 'I am fine thanks',speaker:'left'},
        { id: 4, body: 'Glad to hear that',speaker:'right'},
      ],
    },
    {
      id: '3', //Object ID
      call_id: '6123456',
      account_id: 'Hotstar',
      engine: 'Advanced',
      selected: false,
      transcript: [
        { id: 1, body: 'Hello world', speaker:'left'},
        { id: 2, body: 'How are you?', speaker:'right'},
        { id: 3, body: 'I am fine thanks',speaker:'left'},
        { id: 4, body: 'Glad to hear that',speaker:'right'},
      ]
    },];
  constructor(iconRegistry: MatIconRegistry, sanitizer: DomSanitizer) {
    iconRegistry.addSvgIconLiteral('download', sanitizer.bypassSecurityTrustHtml(DOWNLOAD_ICON));
    iconRegistry.addSvgIconLiteral('chat', sanitizer.bypassSecurityTrustHtml(CHAT_ICON));
    iconRegistry.addSvgIconLiteral('search', sanitizer.bypassSecurityTrustHtml(SEARCH_ICON));
    iconRegistry.addSvgIconLiteral('add', sanitizer.bypassSecurityTrustHtml(ADD_ICON));
   }

  ngOnInit(): void {
    this.conversation = this.conversations[0]
    this.conversations[0].selected = true;
  }
  onConversationSelected(uid: string){
    this.conversation = this.conversations.filter((item)=>item.id == uid)[0];
    this.conversations = this.conversations.map((item)=>{
      if(item.id == uid){
        item.selected = true;
      }else{
        item.selected = false;
      }
      return item;
    })
  }

}
