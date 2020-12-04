import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'toolpanel-adjust',
  templateUrl: './adjust.component.html',
  styleUrls: ['./adjust.component.scss'],
})
export class AdjustComponent implements OnInit {
  constructor() {}
  sliderValue = 10;
  ngOnInit(): void {}
}
