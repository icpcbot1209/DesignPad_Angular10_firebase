import { Component, Input, NgZone, OnInit } from "@angular/core";
import { Item, Page } from "src/app/models/models";
import { ItemType } from "src/app/models/enums";
import { fromEvent, Observable, Subscription } from "rxjs";
import { MoveableService } from "src/app/services/moveable.service";

import * as CSS from "csstype";
import { DesignService } from "src/app/services/design.service";

declare var ResizeObserver;

@Component({
  selector: "app-edit-item",
  templateUrl: "./edit-item.component.html",
  styleUrls: ["./edit-item.component.scss"],
})
export class EditItemComponent implements OnInit {
  @Input() item: Item;
  @Input() itemId: number;
  @Input() pageId: number;

  modulesBubble = {
    toolbar: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link"],
      ["clean"],
    ],
  };

  editorEle: HTMLElement;
  resizeObserver;

  constructor(public ds: DesignService, public moveableService: MoveableService, private zone: NgZone) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.editorEle = document.querySelector<HTMLElement>("#textEditor-" + this.pageId + "-" + this.itemId);
    this.resizeObserver = new ResizeObserver((entries) => {
      this.zone.run(() => {
        let width = JSON.stringify(entries[0].contentRect.width) + "px";
        let height = JSON.stringify(entries[0].contentRect.height) + "px";
        let selectorEle = document.querySelector<HTMLElement>("#textSelector-" + this.pageId + "-" + this.itemId);
        selectorEle.style.width = width;
        selectorEle.style.height = height;
        console.log(entries[0]);

        if (!this.moveableService.isOnResize) {
          this.moveableService.setSelectable(this.itemId, this.pageId);
        }
      });
    });

    this.resizeObserver.observe(this.editorEle);
  }

  ngOnDestroy() {
    this.resizeObserver.unobserve(this.editorEle);
  }

  strTransform(item: Item) {
    let str = `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg) scale(${item.scaleX}, ${item.scaleY})`;
    return str;
  }

  styleItem(item: Item): CSS.Properties {
    if (item.type === ItemType.image)
      return {
        position: "absolute",
        top: 0,
        left: 0,
        width: item.w + "px",
        height: item.h + "px",
        transform: this.strTransform(item),
        WebkitTransform: this.strTransform(item),
        border: "none",
        filter: item.filter,
        WebkitFilter: item.filter,
        clipPath: item.clipStyle,
      };

    if (item.type === ItemType.text)
      return {
        position: "absolute",
        zIndex: 100,
        top: 0,
        left: 0,
        width: item.w + "px",
        // height: item.h + "px",
        // height: "auto",
        transform: this.strTransform(item),
        WebkitTransform: this.strTransform(item),
        // transform: `translate(${item.x}px, ${item.y}px)`,
      };
  }

  stopPropagation(event) {
    event.stopPropagation();
  }

  blur($event) {
    document.querySelectorAll<HTMLElement>("quill-editor").forEach((ele) => {
      if (ele.style.zIndex !== "100") {
        ele.style.zIndex = "100";
      }
    });
  }

  changedEditor(event) {
    let ele = document.querySelector<HTMLElement>(
      "#textEditor-" + this.moveableService.selectedPageId + "-" + this.moveableService.selectedItemId
    );
    console.log(ele.style.height);
    if (ele.style.height != "auto") {
      ele.style.height = "auto";
    }
  }
}
