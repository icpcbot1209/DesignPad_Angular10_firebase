import { Component, OnInit, ViewChild, ElementRef, Input, Output, EventEmitter } from '@angular/core'; // Google Font Key is AIzaSyBipcG_GYuR_AN_TP6SxzppJz9sWZxIJSQ
import { ToolbarService } from '../../../../services/toolbar.service';
import { PAGE_LOAD_SIZE, PageChangeModel } from './font-list.model';

@Component({
  selector: 'toolpanel-font-list',
  templateUrl: './font-list.component.html',
  styleUrls: ['./font-list.component.scss'],
})
export class FontListComponent implements OnInit {
  @ViewChild('perfectScrollbar') perfectScrollbar;

  @Input() isPagingMode: boolean;
  @Output() eventReachEnd = new EventEmitter<PageChangeModel>();
  @Output() eventSearchUser = new EventEmitter<PageChangeModel>();

  fonts;

  constructor(public toolbarService: ToolbarService) {}

  ngOnInit(): void {
    let url = this.toolbarService.url;

    fetch(url)
      .then((res) => res.json())
      .then((out) => {
        this.fonts = out;
        // for (let i = 0; i < this.fonts.length; i++) {
        //   let fontFamily = this.fonts.items[i].family;
        //   let fontUrl = `https://fonts.googleapis.com/css?family=${fontFamily.replace(' ', '+')}`;
        //   let pos = fontFamily.indexOf(':');
        //   if (pos > 0) {
        //     fontFamily = fontFamily.substring(0, pos);
        //   }
        //   let link = document.createElement('link');
        //   link.id = 'myfontlink';
        //   link.setAttribute('rel', 'stylesheet');
        //   link.setAttribute('href', fontUrl);
        //   document.head.appendChild(link);
        // }
      })
      .catch((err) => console.error(err));
  }

  ngAfterViewInit(): void {
    document.querySelector('#searchFontInput').querySelector<HTMLElement>('span').style.display = 'none';
    document.querySelector<HTMLElement>('#sub-menu').style.backgroundColor = 'white';
  }

  checkList() {
    console.log('hello world');
  }

  linkFontUrl() {
    for (let i = 0; i < this.fonts.length; i++) {
      let fontFamily = this.fonts.items[i].family;
      let fontUrl = `https://fonts.googleapis.com/css?family=${fontFamily.replace(' ', '+')}`;
      let pos = fontFamily.indexOf(':');
      if (pos > 0) {
        fontFamily = fontFamily.substring(0, pos);
      }
      let link = document.createElement('link');
      link.id = 'myfontlink';
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', fontUrl);
      document.head.appendChild(link);
    }
  }

  setFontFamily(start, end) {
    for (let i = start; i < end; i++) {
      let fontFamily = this.fonts.items[i].family;
      let fontUrl;

      fontUrl = `https://fonts.googleapis.com/css?family=${fontFamily.replace(' ', '+')}`;
      let pos = fontFamily.indexOf(':');
      if (pos > 0) {
        fontFamily = fontFamily.substring(0, pos);
      }
      let link = document.createElement('link');
      link.id = 'myfontlink';
      link.setAttribute('rel', 'stylesheet');
      link.setAttribute('href', fontUrl);
      document.head.appendChild(link);

      let div = document.createElement('div');
      div.className = 'fontItem';
      div.setAttribute('style', `display: flex; justify-content: space-between; padding: 6px; font-family: ${fontFamily}`);
      div.onmouseover = () => {
        div.style.backgroundColor = '#ddd';
      };
      div.onmouseout = () => {
        div.style.backgroundColor = 'white';
      };
      div.onclick = this.checkList;
      let p = document.createElement('span');
      p.setAttribute('style', 'margin-top: auto; margin-bottom: auto');
      p.innerHTML = this.fonts.items[i].family;
      let span = document.createElement('span');
      span.setAttribute('class', 'material-icons');
      span.setAttribute('style', 'display: none');
      span.textContent = 'done';
      div.append(p);
      div.append(span);
      document.querySelector<HTMLElement>('#fontList').firstChild.firstChild.appendChild(div);
    }
  }
}
