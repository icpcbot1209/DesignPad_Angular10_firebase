import { Component, OnInit } from "@angular/core";
import { DesignService } from "src/app/services/design.service";

@Component({
  selector: "sidebar-text",
  templateUrl: "./text.component.html",
  styleUrls: ["./text.component.scss"],
})
export class TextComponent implements OnInit {
  constructor(public ds: DesignService) {}

  ngOnInit(): void {}

  onKeyUpSearch(event) {}

  onClickAddText() {
    this.ds.sidebar_text_add();

    // let ele = document.querySelectorAll(".target");
    // console.log(ele);
    // console.log(item.itemId);[item.itemId] as HTMLElement
    // console.log(this.textEditor.nativeElement);
    // this.moveableService.makeMoveableText(item.pageId, ele);
  }
}
