// import { Component, Input, NgZone, OnInit } from '@angular/core'
// import { Item, Page } from 'src/app/models/models'
// import { ItemType } from 'src/app/models/enums'
// import { MoveableService } from 'src/app/services/moveable.service'

// import * as CSS from 'csstype'
// import { DesignService } from 'src/app/services/design.service'

// declare var ResizeObserver
// declare var Quill

// @Component({
//   selector: 'app-edit-item',
//   templateUrl: './edit-item.component.html',
//   styleUrls: ['./edit-item.component.scss'],
// })
// export class EditItemComponent implements OnInit {
//   @Input() item: Item
//   @Input() itemId: number
//   @Input() pageId: number

//   editorEle: HTMLElement
//   resizeObserver
//   content: string = 'Add a heading'

//   constructor(public ds: DesignService, public moveableService: MoveableService, private zone: NgZone) {}

//   ngOnInit(): void {

//   }

//   ngAfterViewInit(): void {}

//   ngOnDestroy() {
//     // this.resizeObserver.unobserve(this.editorEle);
//   }

//   styleItem(item: Item): CSS.Properties {
//     if (item.type === ItemType.image)
//       return {
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         width: item.w + 'px',
//         height: item.h + 'px',
//         transform: this.moveableService.strTransform(item),
//         WebkitTransform: this.moveableService.strTransform(item),
//         border: 'none',
//         filter: item.filter,
//         WebkitFilter: item.filter,
//         clipPath: item.clipStyle,
//       }

//     if (item.type === ItemType.text)
//       return {
//         position: 'absolute',
//         zIndex: 100,
//         top: 0,
//         left: 0,
//         // height: item.h + "px",
//         // width: item.w + "px",
//         // width: this.moveableService.isOnResize ? item.w + "px" : "auto",
//         // height: item.h + "px",
//         // height: "auto",
//         transform: this.moveableService.strTransform(item),
//         WebkitTransform: this.moveableService.strTransform(item),
//         // transform: `translate(${item.x}px, ${item.y}px)`,
//       }
//   }

//   stopPropagation(event) {
//     event.stopPropagation()
//   }

//   blur($event) {
//     document.querySelectorAll<HTMLElement>('quill-editor').forEach((ele) => {
//       if (ele.style.zIndex !== '100') {
//         ele.style.zIndex = '100'
//       }
//     })
//   }

//   changedEditor(event) {
//     let ele = document.querySelector<HTMLElement>('#textEditor-' + this.moveableService.selectedPageId + '-' + this.moveableService.selectedItemId)
//     // console.log(event.);
//     if (ele.style.height != 'auto') {
//       ele.style.height = 'auto'
//     }
//   }
// }

import { Component, Input, NgZone, OnInit } from '@angular/core';
import { Item, Page } from 'src/app/models/models';
import { ItemType } from 'src/app/models/enums';
import { MoveableService } from 'src/app/services/moveable.service';
import { ToolbarService } from 'src/app/services/toolbar.service';
import { DesignService } from 'src/app/services/design.service';

import * as CSS from 'csstype';

declare var Quill;
declare var ResizeObserver;

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss'],
})
export class EditItemComponent implements OnInit {
  @Input() item: Item;
  @Input() itemId: number;
  @Input() pageId: number;

  editorEle: HTMLElement;
  resizeObserver;

  constructor(public moveableService: MoveableService, private zone: NgZone) {}

  ngOnInit() {
    this.moveableService.selectedPageId = this.pageId.toString();
    this.moveableService.selectedItemId = this.itemId.toString();
  }

  ngAfterViewInit(): void {
    this.editorEle = document.querySelector<HTMLElement>('#textEditor-' + this.pageId + '-' + this.itemId);
    this.resizeObserver = new ResizeObserver((entries) => {
      this.zone.run(() => {
        let width = JSON.stringify(entries[0].contentRect.width) + 'px';
        let height = JSON.stringify(entries[0].contentRect.height) + 'px';
        let selectorEle = document.querySelector<HTMLElement>('#textSelector-' + this.pageId + '-' + this.itemId);
        let item = this.moveableService.getItem(selectorEle);
        item.x = item.x - (entries[0].contentRect.width - parseInt(selectorEle.style.width)) / 2;
        selectorEle.style.width = width;
        selectorEle.style.height = height;
        selectorEle.style.transform = `translate(${item.x}px, ${item.y}px)`;
        // item.w = entries[0].contentRect.width;
        // item.h = entries[0].contentRect.height;

        // console.log(parseInt(selectorEle.style.width));

        // let editorEle = document.querySelector<HTMLElement>("#textEditor-" + this.pageId + "-" + this.itemId);
        // item = this.moveableService.getItem(editorEle);
        // item.x = item.x-(e.)

        if (!this.moveableService.isOnResize) {
          this.moveableService.setSelectable(this.itemId, this.pageId);
        }
      });
    });

    this.resizeObserver.observe(this.editorEle);

    // document.querySelector<HTMLInputElement>('#fontSizeInput').value = this['item']['fontSize'];
    // console.log(this['item']['fontSize']);
  }

  ngOnDestroy() {
    this.resizeObserver.unobserve(this.editorEle);
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
        // height: item.h + 'px',
        // width: item.w + "px",
        // width: this.moveableService.isOnResize ? item.w + "px" : "auto",
        // height: item.h + "px",
        width: 'auto',
        height: 'auto',
        transform: this.moveableService.strTransform(item),
        WebkitTransform: this.moveableService.strTransform(item),
        fontSize: '24px',
        // transform: `translate(${item.x}px, ${item.y}px)`,
      };
  }
  stopPropagation(event) {
    event.stopPropagation();
  }
}
