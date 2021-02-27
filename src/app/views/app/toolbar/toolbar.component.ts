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

  changeFileType(event) {
    this.selectedFileType = event;
  }
}
