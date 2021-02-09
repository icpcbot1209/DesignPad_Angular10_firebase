import { Component, Input, OnInit } from '@angular/core';

import { DesignService } from 'src/app/services/design.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { Item, Page } from 'src/app/models/models';

import * as CSS from 'csstype';

@Component({
  selector: 'app-svgselector',
  templateUrl: './svgselector.component.html',
  styleUrls: ['./svgselector.component.scss'],
})
export class SVGSelectorComponent implements OnInit {
  @Input('item') item;

  constructor(public ds: DesignService, public moveableService: MoveableService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.getSVGElement(this.item);
    // this.ds.onSelectNothing();
  }

  styleItemPosition(item: Item): CSS.Properties {
    return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: item.w + 'px',
      height: item.h + 'px',
      transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`,
    };
  }

  getSVGElement(item) {
    // This can be downloaded directly:
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = (event) => {
      var blob = xhr.response;

      var fr = new FileReader();
      fr.onload = (result) => {
        let svgEle = document.querySelector('#SVGElement-' + item.pageId + '-' + item.itemId);
        let str = result.target['result'].toString();

        svgEle.innerHTML = str;

        let htmlCollect = svgEle.querySelectorAll('svg');
        if (parseFloat(htmlCollect[0].getAttribute('width')) && parseFloat(htmlCollect[0].getAttribute('height'))) {
          let width = htmlCollect[0].clientWidth;
          let height = htmlCollect[0].clientHeight;

          htmlCollect[0].setAttribute('viewBox', '0, 0, ' + width + ', ' + height);
          let w, h;
          if (width > height) {
            w = 150;
            h = (height / width) * 150;
          } else {
            h = 150;
            w = (width / height) * 150;
          }
          htmlCollect[0].setAttribute('width', w);
          htmlCollect[0].setAttribute('height', h);
        }

        this.moveableService.setSelectable(this.item.itemId, this.item.pageId, '#SVGSelector-');

        this.ds.setSVGColorCollection();
      };

      fr.readAsText(blob);
    };
    xhr.open('GET', item.url);
    xhr.send();
  }
}
