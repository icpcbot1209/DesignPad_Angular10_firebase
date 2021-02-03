import { MoveableService } from 'src/app/services/moveable.service';
import { Component, OnInit } from '@angular/core';
import { ItemStatus } from 'src/app/models/enums';
import { DesignService } from 'src/app/services/design.service';
import { ToolbarService } from 'src/app/services/toolbar.service';

@Component({
  selector: 'sidebar-text',
  templateUrl: './text.component.html',
  styleUrls: ['./text.component.scss'],
})
export class TextComponent implements OnInit {
  constructor(public ds: DesignService, public moveableService: MoveableService, public toolbarService: ToolbarService) {}

  ngOnInit(): void {}

  onKeyUpSearch(event) {}

  onClickAddText() {
    this.ds.sidebar_text_add();

    this.toolbarService.isCreateQuill = true;
  }
}
