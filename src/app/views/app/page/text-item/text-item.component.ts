import { Component, OnInit, Input, AfterViewInit, ViewChild, Output, EventEmitter, ElementRef } from "@angular/core";
import { Item, Page } from "src/app/models/models";
import { ItemType } from "src/app/models/enums";
import { MoveableService } from "src/app/services/moveable.service";

import * as CSS from "csstype";

import { OnSelectEnd } from "selecto";

@Component({
  selector: "app-text-item",
  templateUrl: "./text-item.component.html",
  styleUrls: ["./text-item.component.scss"],
})
export class TextItemComponent implements OnInit, AfterViewInit {
  @Input() item: Item;
  @Input() itemId: number;
  @Input() pageId: number;
  @ViewChild("textInput") textInput: ElementRef;

  modulesBubble = {
    toolbar: [
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }],
      ["link"],
      ["clean"],
    ],
  };

  constructor(public moveableService: MoveableService) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    document.querySelectorAll(".target").forEach((ele) => {
      if (
        ele.getAttribute("itemType") == "2" &&
        Number(ele.getAttribute("itemId")) == this.itemId &&
        Number(ele.getAttribute("pageId")) == this.pageId
      ) {
        this.moveableService.getItem(ele as HTMLElement).selected = true;
        let arrEles = [];
        arrEles.push(ele);
        this.moveableService.selecto.setSelectedTargets(arrEles);
        let func: OnSelectEnd = {
          selected: arrEles,
          afterAdded: null,
          afterRemoved: null,
          isDragStart: false,
          isDouble: false,
          added: arrEles,
          removed: [],
          rect: null,
          inputEvent: null,
          currentTarget: arrEles[0],
        };
        this.moveableService.selecto.emit("selectEnd", func);
      }
    });
  }
  styleItemPosition(item: Item): CSS.Properties {
    if (item.type === ItemType.image)
      return {
        position: "absolute",
        top: 0,
        left: 0,
        width: item.w + "px",
        height: item.h + "px",
        transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`,
      };

    if (item.type === ItemType.text)
      return {
        position: "absolute",
        top: 0,
        left: 0,
        width: item.w + "px",
        // height: "auto",
        height: item.h + "px",
        transform: `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg)`,
      };
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
        top: 0,
        left: 0,
        width: item.w + "px",
        height: item.h + "px",
        // height: "auto",
        transform: this.strTransform(item),
        WebkitTransform: this.strTransform(item),
        // transform: `translate(${item.x}px, ${item.y}px)`,
      };
  }
  strTransform(item: Item) {
    let str = `translate(${item.x}px, ${item.y}px) rotate(${item.rotate}deg) scale(${item.scaleX}, ${item.scaleY})`;
    return str;
  }
  onMouseMoveItem(event: MouseEvent, item: Item) {
    let pageEl: HTMLElement = document.querySelector(`#page-${item.pageId}`);
    let rect: DOMRect = pageEl.getBoundingClientRect();
    let isOverflow =
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom;

    if (!isOverflow) {
      item.hovered = true;
    } else {
      item.hovered = false;
    }

    if (this.moveableService.isMouseDown) {
      this.moveableService.isDrag = true;
    }
  }

  enableTextEdit(event: MouseEvent) {
    this.moveableService.enableTextEdit(event);
  }

  onMouseDown() {
    this.moveableService.isMouseDown = true;
  }
}