import { Component, OnDestroy, OnInit } from '@angular/core';
import { Colors } from 'src/app/constants/colors.service';
import { ItemStatus, ItemType } from 'src/app/models/enums';
import { DesignService } from 'src/app/services/design.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { DownloadService } from 'src/app/services/download.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor(public ds: DesignService, public moveableService: MoveableService, public downloadService: DownloadService) {}

  theDesignWidth;
  theDesignHeight;

  activeColor = Colors.getColors().separatorColor;
  ItemType = ItemType;
  ItemStatus = ItemStatus;

  selectedFileType = 'PDF';
  fileTypeItems = [];

  ngOnInit(): void {
    this.fileTypeItems = ['PDF', 'JPG'];
  }

  setDesign() {
    this.ds.theDesign.category.size.x = this.theDesignWidth;
    this.ds.theDesign.category.size.y = this.theDesignHeight;
    this.moveableService.isDimension = false;
  }

  showDimensionContent() {
    this.theDesignWidth = this.ds.pageW();
    this.theDesignHeight = this.ds.pageH();
    this.moveableService.isDimension = !this.moveableService.isDimension;
  }

  showPositionContent() {
    this.moveableService.isPosition = !this.moveableService.isPosition;
    this.detectOverlaps();
  }

  changeFileType(event) {
    this.selectedFileType = event;
  }

  detectOverlaps() {
    let selectedItem = document.querySelector(
      this.getType(this.ds.theDesign.pages[this.moveableService.selectedPageId].items[this.moveableService.selectedItemId].type) +
        this.moveableService.selectedPageId +
        '-' +
        this.moveableService.selectedItemId
    );
    const itemsOnPage = this.ds.theDesign.pages[this.moveableService.selectedPageId].items;

    for (let i = 0; i < itemsOnPage.length; i++) {
      if (itemsOnPage[i].itemId != this.moveableService.selectedItemId) {
        let otherItem = document.querySelector(this.getType(itemsOnPage[i].type) + itemsOnPage[i].pageId + '-' + itemsOnPage[i].itemId);

        if (this.collision(selectedItem, otherItem)) {
          console.log(itemsOnPage[i]);
        }
      }
    }
  }

  getType(status) {
    let type;

    switch (status) {
      case ItemType.image:
        type = '#imageElement-';
        break;
      case ItemType.text:
        type = '#textEditor-';
        break;
      case ItemType.element:
        type = '#SVGElement-';
        break;
    }

    return type;
  }

  collision(item, otherItem) {
    let matrix = new WebKitCSSMatrix(item.style.transform);

    let x1 = matrix.m41;
    let y1 = matrix.m42;
    let w1 = item.offsetWidth;
    let h1 = item.offsetHeight;
    let r1 = x1 + w1;
    let b1 = y1 + h1;

    matrix = new WebKitCSSMatrix(otherItem.style.transform);
    let x2 = matrix.m41;
    let y2 = matrix.m42;
    let w2 = otherItem.offsetWidth;
    let h2 = otherItem.offsetHeight;
    let r2 = x2 + w2;
    let b2 = y2 + h2;

    if (b1 < y2 || y1 > b2 || r1 < x2 || x1 > r2) return false;
    return true;
  }

  forwardItem() {
    let item = this.ds.theDesign.pages[this.moveableService.selectedPageId].items[this.moveableService.selectedItemId];

    item.zIndex += 1;
  }

  backwardItem() {
    let item = this.ds.theDesign.pages[this.moveableService.selectedPageId].items[this.moveableService.selectedItemId];

    item.zIndex -= 1;
  }
}
