import { MoveableService } from 'src/app/services/moveable.service';
import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { Item, Page } from 'src/app/models/models';
import { Colors } from 'src/app/constants/colors.service';
import { ItemType } from 'src/app/models/enums';

import * as CSS from 'csstype';

@Component({
  selector: 'app-page',
  templateUrl: './page.component.html',
  styleUrls: ['./page.component.scss'],
})
export class PageComponent implements OnInit, AfterViewInit {
  @Input() page: Page;
  @Input() pageId: number;

  ItemType = ItemType;

  constructor(
    public ds: DesignService,
    public moveableService: MoveableService
  ) {}

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

  styleCard(): CSS.Properties {
    return {
      borderRadius: '0%',
      overflow: 'visible',
      width: this.ds.page_vw + 'px',
      height: this.ds.page_vh + 'px',
      boxShadow: this.pageId == this.ds.thePageId ? '' : 'none'
    };
  }

  styleCardInside(): CSS.Properties {
    return {
      transformOrigin: 'top left',
      transform: `scale(${this.ds.zoomValue / 100})`,
      width: this.ds.pageW() + 'px',
      height: this.ds.pageH() + 'px'
    };
  }


  styleItem(item: Item)  : CSS.Properties {
    if(item.type===ItemType.image) return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: item.w + 'px',
      height: item.h + 'px',
      transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`,
      WebkitTransform: `${item.flipX?'scaleX(-1)':''} + ${item.flipY?' scaleY(-1)':''}`,
      border: 'none',
      filter: item.filter,
      WebkitFilter: item.filter,
      clipPath: item.clipStyle,
    };

    if (item.type === ItemType.text) return {
      position: 'absolute',
      top: 0,
      left: 0,
      width: item.w + 'px',
      height: 'auto',
      transform: `translate(${item.x}px, ${item.y}px)`
    };
  }


}
