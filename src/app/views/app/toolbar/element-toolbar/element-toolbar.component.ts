import { Component, OnInit } from '@angular/core';
import { DesignService } from 'src/app/services/design.service';
import { MoveableService } from 'src/app/services/moveable.service';
import { ItemStatus, ItemType } from '../../../../models/enums';
import { Colors } from '../../../../constants/colors.service';

@Component({
  selector: 'app-element-toolbar',
  templateUrl: './element-toolbar.component.html',
  styleUrls: ['./element-toolbar.component.scss'],
})
export class ElementToolbarComponent implements OnInit {
  ItemStatus = ItemStatus;
  activeColor = Colors.getColors().separatorColor;

  constructor(public moveableService: MoveableService, public ds: DesignService) {}

  ngOnInit(): void {}

  changeElementColor(event) {
    console.log(event.value);
  }
}
