import { Component, OnDestroy, OnInit } from '@angular/core';
import { Colors } from 'src/app/constants/colors.service';
import { ItemType } from 'src/app/models/enums';
import { ToolbarService } from 'src/app/services/toolbar.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss'],
})
export class ToolbarComponent implements OnInit {
  constructor(public ts: ToolbarService) {}

  foreColor = Colors.getColors().themeColor1;
  ItemType = ItemType;
  ngOnInit(): void {
    setInterval(() => {}, 1000);
  }

  setImageStatus(image_status) {
    if (this.ts.image_status === image_status)
      this.ts.image_status = this.ts.IMAGE_STATUS().none;
    else this.ts.image_status = image_status;
  }
}
