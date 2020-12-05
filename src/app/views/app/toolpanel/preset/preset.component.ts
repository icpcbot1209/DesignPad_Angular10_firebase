import { Component, OnInit } from '@angular/core';
import { ImageFilterObj } from 'src/app/models/image-filter';
import { Item } from 'src/app/models/models';
import { DesignService } from 'src/app/services/design.service';

@Component({
  selector: 'toolpanel-preset',
  templateUrl: './preset.component.html',
  styleUrls: ['./preset.component.scss'],
})
export class PresetComponent implements OnInit {
  constructor(public ds: DesignService) {}
  ngOnInit(): void {}
}
