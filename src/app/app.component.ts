import { AfterViewChecked, AfterViewInit, Component, DoCheck, OnChanges } from '@angular/core';
import {Router} from '@angular/router';
import {DomSanitizer} from '@angular/platform-browser';
import {MatIconRegistry} from '@angular/material/icon';
import { AppService } from './app.service';



const MENU_ICON = `<?xml version="1.0" ?><svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><defs><style>.cls-1{fill:none;stroke:#fff;stroke-linecap:round;stroke-linejoin:round;stroke-width:2px;}</style></defs><title/><g data-name="67-menu" id="_67-menu"><rect class="cls-1" height="12" width="12" x="1" y="1"/><rect class="cls-1" height="12" width="12" x="1" y="19"/><rect class="cls-1" height="12" width="12" x="19" y="19"/><rect class="cls-1" height="12" width="12" x="19" y="1"/></g></svg>`;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AppService]
  
})
export class AppComponent {
  
  constructor(public router: Router,iconRegistry: MatIconRegistry, sanitizer: DomSanitizer, private appService: AppService) {
    iconRegistry.addSvgIconLiteral('menu', sanitizer.bypassSecurityTrustHtml(MENU_ICON));
  }
  title = 'yactraq-transcripts-trial';
}
