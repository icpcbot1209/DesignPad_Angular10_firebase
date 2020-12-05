import { Component, OnInit } from '@angular/core';
import { ImageFilterObj } from 'src/app/models/image-filter';
import { Item } from 'src/app/models/models';
import { DesignService } from 'src/app/services/design.service';

@Component({
  selector: 'toolpanel-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss'],
})
export class FilterComponent implements OnInit {
  constructor(public ds: DesignService) {}
  ngOnInit(): void {}

  onChangeObj(event) {
    let css = this.ds.filterObj.css();
    this.ds.setFilterCss(css);
  }
}
