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

  color = {};

  constructor(public moveableService: MoveableService, public ds: DesignService) {}

  ngOnInit(): void {
    // if (!this.color['a']) {
    //   this.color['a'] = [];
    // }
    // this.color['a'].push('1');
    // this.color['a'].push('2');
    // console.log(this.color);
  }

  changeElementColor(event, index) {
    this.ds.theDesign.pages[this.moveableService.selectedPageId].items[this.moveableService.selectedItemId]['color'][index] = event.target.value;
    console.log(event.target.value);
  }
}
