import { MoveableService } from 'src/app/services/moveable.service';
import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { Item, Page } from 'src/app/models/models';
import { Colors } from 'src/app/constants/colors.service';
import { ItemType } from 'src/app/models/enums';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

import { OnSelectEnd } from 'selecto';
import * as CSS from 'csstype';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit, AfterViewInit {
  @Input() page: Page;
  @Input() pageId: number;
  @ViewChild('textEditor') textEditor: ElementRef;
  //  @ViewChild() textEditor: ElementRef;

  ItemType = ItemType;

  modulesBubble = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link'],
      ['clean'],
    ],
  };

  constructor(public ds: DesignService, public moveableService: MoveableService, public sanitizer: DomSanitizer, private http: HttpClient) {}

  colors = Colors;

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.setActivePage();
    });
  }

  setActivePage() {
    if (this.ds.thePageId == this.pageId) return;
    console.log('active page:' + this.pageId);
    this.ds.thePageId = this.pageId;
  }

  onClickPage() {
    this.setActivePage();
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    let data = JSON.parse(event.dataTransfer.getData('jsonAssetImage'));
    this.setActivePage();
    this.ds.addImageItem(data);
  }

  test() {
    alert('aa');
  }

  /******************
   ***** Styles
   ******************/

  styleCard(): CSS.Properties {
    return {
      borderRadius: '0%',
      overflow: 'visible',
      width: this.ds.page_vw + 'px',
      height: this.ds.page_vh + 'px',
      boxShadow: this.pageId == this.ds.thePageId ? '' : 'none',
    };
  }

  styleCardInside(): CSS.Properties {
    return {
      transformOrigin: 'top left',
      transform: `scale(${this.ds.zoomValue / 100})`,
      width: this.ds.pageW() + 'px',
      height: this.ds.pageH() + 'px',
    };
  }

  styleLayer(): CSS.Properties {
    return {
      position: 'absolute',
      top: '0',
      left: '0',
      height: '100%',
      width: '100%',
    };
  }

  styleItemPosition(item: Item): CSS.Properties {
    if (item.type === ItemType.image)
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        width: item.w + 'px',
        height: item.h + 'px',
        transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`,
      };

    if (item.type === ItemType.text)
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        width: item.w + 'px',
        height: item.h + 'px',
        transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`,
      };

    if (item.type === ItemType.element)
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        width: item.w + 'px',
        height: item.h + 'px',
        transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`,
      };
  }

  styleItem(item: Item): CSS.Properties {
    if (item.type === ItemType.image)
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        width: item.w + 'px',
        height: item.h + 'px',
        transform: this.moveableService.strTransform(item),
        WebkitTransform: this.moveableService.strTransform(item),
        border: 'none',
        filter: item.filter,
        WebkitFilter: item.filter,
        clipPath: item.clipStyle,
      };

    if (item.type === ItemType.text)
      return {
        position: 'absolute',
        zIndex: 100,
        top: 0,
        left: 0,
        width: item.w + 'px',
        transform: this.moveableService.strTransform(item),
        WebkitTransform: this.moveableService.strTransform(item),
      };

    if (item.type === ItemType.element)
      return {
        position: 'absolute',
        top: 0,
        left: 0,
        width: item.w + 'px',
        height: item.h + 'px',
        transform: this.moveableService.strTransform(item),
        WebkitTransform: this.moveableService.strTransform(item),
      };
  }

  onMouseMoveItem(event: MouseEvent, item: Item) {
    let pageEl: HTMLElement = document.querySelector(`#page-${item.pageId}`);
    let rect: DOMRect = pageEl.getBoundingClientRect();
    let isOverflow = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;

    if (!isOverflow) {
      item.hovered = true;
    } else {
      item.hovered = false;
    }
  }

  getSafeUrl(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
