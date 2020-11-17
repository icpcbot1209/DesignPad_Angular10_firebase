import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { DesignService } from 'src/app/services/design.service';

declare var ResizeObserver;

@Component({
  selector: 'app-design-panel',
  templateUrl: './design-panel.component.html',
  styleUrls: ['./design-panel.component.scss'],
})
export class DesignPanelComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(public designService: DesignService, private zone: NgZone) {}

  @ViewChild('host') host: ElementRef;

  resizeObserver;
  responsive_w: number = 1000;
  responsive_h: number = 500;
  pageRate = 2;

  ngOnInit(): void {
    this.designService.init();
  }

  ngAfterViewInit(): void {
    this.resizeObserver = new ResizeObserver((entries) => {
      this.zone.run(() => {
        let width = entries[0].contentRect.width;
        let height = entries[0].contentRect.height;

        this.responsive_w = Math.min(
          (height - 50) * this.pageRate,
          width - 200
        );

        if (this.responsive_w < 300) this.responsive_w = 300;
        this.responsive_h = this.responsive_w / this.pageRate;
      });
    });

    this.resizeObserver.observe(this.host.nativeElement);
  }

  ngOnDestroy() {
    this.resizeObserver.unobserve(this.host.nativeElement);
  }

  fillColor = 'rgb(255, 0, 0)';

  changeColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    this.fillColor = `rgb(${r}, ${g}, ${b})`;
  }
}
